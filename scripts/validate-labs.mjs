import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const labsRoot = join(root, "content", "labs");
const publicRoot = join(root, "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const demoFilePattern = /^demos\/[a-z0-9]+(?:-[a-z0-9]+)*\.json$/;
const hodIdPattern = /^(ANSIBLE|RHEL)-HOD-[0-9]{3,}$/;
const demoIdPattern = /^(ANSIBLE|RHEL)-HOD-[0-9]{3,}-D[0-9]{2,}$/;
const supportedTopics = new Set(["Ansible", "RHEL"]);
const topicIdPrefixes = new Map([["Ansible", "ANSIBLE"], ["RHEL", "RHEL"]]);
const imagePattern = /^\/demos\/.+\.(png|jpe?g|webp|svg)$/i;
const maxImageBytes = 2 * 1024 * 1024;
const maxLabImageBytes = 12 * 1024 * 1024;
const maxRecordingBytes = 1024 * 1024;
const requiredRecordingGeometry = "120x34";
const maximumRecordingIdleGap = 1.25;
const minimumCompletionHold = 1;
const sensitiveRecordingPattern = /(?:VNC|SSH) Password|(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})|password\s*=|\[sudo\] password|(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|machine-id|boot-id/i;
const errors = [];
const warnings = [];

const fail = (source, message) => errors.push(`${source}: ${message}`);
const warn = (source, message) => warnings.push(`${source}: ${message}`);
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const validateGuidanceCallout = (callout, sourceName) => {
  if (!nonEmptyString(callout?.title)) fail(sourceName, "title is required");
  if (!Array.isArray(callout?.paragraphs) || callout.paragraphs.length === 0 || callout.paragraphs.some((paragraph) => !nonEmptyString(paragraph))) {
    fail(sourceName, "paragraphs must contain at least one non-empty paragraph");
  }
  (callout?.links ?? []).forEach((link, linkIndex) => {
    if (!nonEmptyString(link?.label)) fail(sourceName, `links[${linkIndex}].label is required`);
    try { new URL(link?.href); } catch { fail(sourceName, `links[${linkIndex}].href must be a valid URL`); }
  });
};
const validatePortableCommandPaths = (value, sourceName, path = []) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validatePortableCommandPaths(item, sourceName, [...path, index]));
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, item]) => {
    const itemPath = [...path, key];
    if (key === "command" && typeof item === "string" && /\/home\/rajat(?:\/|\b)/.test(item)) {
      fail(sourceName, `${itemPath.join(".")} must use $HOME or ~ instead of a hardcoded /home/rajat path`);
    }
    validatePortableCommandPaths(item, sourceName, itemPath);
  });
};

const directories = readdirSync(labsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(labsRoot, entry.name, "lab.json")))
  .map((entry) => entry.name)
  .sort();

if (!directories.length) fail("content/labs", "at least one lab directory is required");

const slugs = new Set();
const titles = new Set();
const orders = new Set();
const hodNumbers = new Set();
const hodIds = new Set();
const demoTrackingIds = new Set();
const crossLabStepsByCommandSequence = new Map();
let totalSteps = 0;
let totalImages = 0;
let totalRecordings = 0;

for (const directory of directories) {
  const source = join(labsRoot, directory, "lab.json");
  const reviewSource = join(labsRoot, directory, "review.md");
  if (!existsSync(reviewSource)) {
    fail(directory, "review.md is required; complete the instructional audit before publishing");
  } else {
    const review = readFileSync(reviewSource, "utf8");
    const requiredReviewHeadings = [
      "## Readiness",
      "## Findings",
      "## Comparison review",
      "## Learner experience",
      "## Role-based review",
      "### Technical Support Engineer",
      "### Solution Architect / Pre-Sales",
      "### Technical Consultant",
      "### Instructor",
      "### Student",
      "### Technical Marketing Manager",
      "### Technical Account Manager",
      "### Sales",
    ];
    requiredReviewHeadings.forEach((heading) => {
      if (!review.includes(heading)) fail(directory, `review.md must include ${heading}`);
    });
    requiredReviewHeadings.filter((heading) => heading.startsWith("### ")).forEach((heading) => {
      const start = review.indexOf(heading);
      if (start < 0) return;
      const contentStart = start + heading.length;
      const nextHeading = review.indexOf("\n### ", contentStart);
      const section = review.slice(contentStart, nextHeading >= 0 ? nextHeading : review.length).trim();
      if (section.length < 40) fail(directory, `${heading} must contain a substantive review finding`);
    });
  }
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(source, "utf8"));
  } catch (error) {
    fail(directory, `invalid JSON (${error.message})`);
    continue;
  }
  if (Object.hasOwn(manifest, "demos")) {
    fail(directory, "embedded demos are not allowed; store each demo under demos/ and reference it through demoFiles");
  }
  if (!Array.isArray(manifest.demoFiles)) {
    fail(directory, "demoFiles must be an array");
    manifest.demoFiles = [];
  }
  if (new Set(manifest.demoFiles).size !== manifest.demoFiles.length) {
    fail(directory, "demoFiles must not contain duplicate paths");
  }
  const demos = [];
  const referencedDemoFiles = new Set();
  manifest.demoFiles.forEach((relativePath, demoIndex) => {
    if (!nonEmptyString(relativePath) || !demoFilePattern.test(relativePath)) {
      fail(directory, `demoFiles[${demoIndex}] must match demos/<slug>.json`);
      return;
    }
    referencedDemoFiles.add(relativePath);
    const demoSource = join(labsRoot, directory, relativePath);
    if (!existsSync(demoSource)) {
      fail(directory, `demo file does not exist: ${relativePath}`);
      return;
    }
    let demoFile;
    try {
      demoFile = JSON.parse(readFileSync(demoSource, "utf8"));
    } catch (error) {
      fail(relativePath, `invalid JSON (${error.message})`);
      return;
    }
    if (demoFile.schemaVersion !== 1) fail(relativePath, "schemaVersion must be 1");
    if (demoFile.hodId !== manifest.hodId) fail(relativePath, `hodId must match ${manifest.hodId}`);
    if (demoFile.$schema !== "../../demo.schema.json") fail(relativePath, "$schema must reference ../../demo.schema.json");
    const demo = { ...demoFile };
    delete demo.$schema;
    delete demo.schemaVersion;
    delete demo.hodId;
    validatePortableCommandPaths(demo, relativePath);
    demos.push(demo);
  });
  const demosDirectory = join(labsRoot, directory, "demos");
  if (existsSync(demosDirectory)) {
    readdirSync(demosDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
      .forEach((entry) => {
        const relativePath = `demos/${entry.name}`;
        if (!referencedDemoFiles.has(relativePath)) fail(directory, `unreferenced demo file: ${relativePath}`);
      });
  }
  const lab = { ...manifest, demos };
  validatePortableCommandPaths(manifest, directory);

  if (lab.schemaVersion !== 3) fail(directory, "schemaVersion must be 3");
  if (!slugPattern.test(lab.slug ?? "")) fail(directory, "slug must contain lowercase words separated by hyphens");
  if (lab.slug !== directory) fail(directory, `directory name must match slug ${lab.slug ?? "(missing)"}`);
  if (slugs.has(lab.slug)) fail(directory, `duplicate slug ${lab.slug}`);
  slugs.add(lab.slug);

  ["title", "shortDescription", "description", "coverImage", "coverAlt", "duration", "topic", "platform", "status"].forEach((key) => {
    if (!nonEmptyString(lab[key])) fail(directory, `${key} is required`);
  });
  ["seoTitle", "seoDescription", "audience"].forEach((key) => {
    if (lab[key] !== undefined && !nonEmptyString(lab[key])) fail(directory, `${key} must be a non-empty string when supplied`);
  });
  if (!supportedTopics.has(lab.topic)) fail(directory, "topic must be one of the supported technology tracks: Ansible or RHEL");
  if (lab.socialImage !== undefined && !/^\/demos\/.+\.(png|jpe?g|webp)$/i.test(lab.socialImage)) {
    fail(directory, "socialImage must be a PNG, JPG, or WebP path under /demos");
  }
  if (lab.socialImage !== undefined) {
    if (!Number.isInteger(lab.socialImageWidth) || lab.socialImageWidth < 600) {
      fail(directory, "socialImageWidth must record the social image width and be at least 600 pixels");
    }
    if (!Number.isInteger(lab.socialImageHeight) || lab.socialImageHeight < 315) {
      fail(directory, "socialImageHeight must record the social image height and be at least 315 pixels");
    }
  }
  if (titles.has(lab.title)) fail(directory, `duplicate title ${lab.title}`);
  titles.add(lab.title);

  if (!Number.isInteger(lab.durationMinutes) || lab.durationMinutes < 1) fail(directory, "durationMinutes must be a positive integer");
  if (!Number.isInteger(lab.publishedOrder) || lab.publishedOrder < 0) fail(directory, "publishedOrder must be a non-negative integer");
  if (!Number.isInteger(lab.hodNumber) || lab.hodNumber < 1) fail(directory, "hodNumber must be a positive integer");
  const trackNumber = `${lab.topic}:${lab.hodNumber}`;
  if (hodNumbers.has(trackNumber)) fail(directory, `duplicate hodNumber ${lab.hodNumber} in the ${lab.topic} track`);
  hodNumbers.add(trackNumber);
  if (!hodIdPattern.test(lab.hodId ?? "")) fail(directory, "hodId must use a track-qualified format such as ANSIBLE-HOD-001 or RHEL-HOD-001");
  if (hodIds.has(lab.hodId)) fail(directory, `duplicate hodId ${lab.hodId}`);
  hodIds.add(lab.hodId);
  const expectedHodId = `${topicIdPrefixes.get(lab.topic)}-HOD-${String(lab.hodNumber).padStart(3, "0")}`;
  if (lab.hodId !== expectedHodId) fail(directory, `hodId must match its technology track and hodNumber (${expectedHodId})`);
  if (orders.has(lab.publishedOrder)) warn(directory, `publishedOrder ${lab.publishedOrder} is shared with another lab`);
  orders.add(lab.publishedOrder);
  if (!["Beginner", "Intermediate", "Expert"].includes(lab.difficulty)) fail(directory, "difficulty is invalid");
  if (!["Available", "Coming soon"].includes(lab.status)) fail(directory, "status is invalid");

  ["tags", "outcomes", "prerequisites"].forEach((key) => {
    if (!Array.isArray(lab[key]) || lab[key].length === 0) fail(directory, `${key} must contain at least one item`);
  });
  if (!Array.isArray(lab.demoFiles)) fail(directory, "demoFiles must be an array");
  if (lab.plannedDemos !== undefined) {
    if (!Array.isArray(lab.plannedDemos) || lab.plannedDemos.length === 0) {
      fail(directory, "plannedDemos must contain at least one planned demonstration when provided");
    }
    const plannedIds = new Set();
    (lab.plannedDemos ?? []).forEach((demo, index) => {
      const sourceName = `plannedDemos[${index}]`;
      if (!demoIdPattern.test(demo?.demoId ?? "")) fail(directory, `${sourceName}.demoId must use a track-qualified demo ID`);
      if (!(demo?.demoId ?? "").startsWith(`${lab.hodId}-D`)) fail(directory, `${sourceName}.demoId must belong to ${lab.hodId}`);
      if (plannedIds.has(demo.demoId)) fail(directory, `${sourceName}.demoId must be unique within the HOD`);
      plannedIds.add(demo.demoId);
      ["title", "audience", "objective"].forEach((key) => {
        if (!nonEmptyString(demo?.[key])) fail(directory, `${sourceName}.${key} must be a non-empty string`);
      });
      if (!["Beginner", "Intermediate", "Expert"].includes(demo?.level)) fail(directory, `${sourceName}.level is invalid`);
    });
  }
  if (lab.status === "Available") {
    if (lab.demoFiles?.length === 0) fail(directory, "an available HOD must reference at least one demo file");
    ["seoTitle", "seoDescription", "socialImage", "socialImageWidth", "socialImageHeight", "recap"].forEach((key) => {
      if (lab[key] === undefined || lab[key] === "") fail(directory, `${key} is required for an available HOD`);
    });
    if ((lab.seoTitle ?? "").length > 70) warn(directory, "seoTitle may be truncated because it exceeds 70 characters");
    if ((lab.seoDescription ?? "").length > 170) warn(directory, "seoDescription may be truncated because it exceeds 170 characters");
  }
  if (lab.recap) {
    if (!nonEmptyString(lab.recap.title) || !nonEmptyString(lab.recap.introduction)) fail(directory, "recap requires a title and introduction");
    if (!Array.isArray(lab.recap.items) || lab.recap.items.length < 3) fail(directory, "recap.items must contain at least three takeaways");
    (lab.recap.items ?? []).forEach((item, itemIndex) => {
      if (!nonEmptyString(item?.title) || !nonEmptyString(item?.detail)) fail(directory, `recap.items[${itemIndex}] requires a title and detail`);
    });
    if (lab.recap.selfCheck) {
      if (!nonEmptyString(lab.recap.selfCheck.title) || !nonEmptyString(lab.recap.selfCheck.introduction)) fail(directory, "recap.selfCheck requires a title and introduction");
      if (!Array.isArray(lab.recap.selfCheck.questions) || lab.recap.selfCheck.questions.length < 3) fail(directory, "recap.selfCheck.questions must contain at least three questions");
      (lab.recap.selfCheck.questions ?? []).forEach((question, questionIndex) => {
        if (!nonEmptyString(question)) fail(directory, `recap.selfCheck.questions[${questionIndex}] must be a non-empty string`);
      });
    }
  }
  ["tags", "outcomes"].forEach((key) => {
    (lab[key] ?? []).forEach((item, index) => {
      if (!nonEmptyString(item)) fail(directory, `${key}[${index}] must be a non-empty string`);
    });
  });
  if (lab.overview) {
    ["title", "introduction"].forEach((key) => {
      if (!nonEmptyString(lab.overview?.[key])) fail(directory, `overview.${key} is required`);
    });
    if (!Array.isArray(lab.overview.items) || lab.overview.items.length < 2) {
      fail(directory, "overview.items must contain at least two items");
    }
    (lab.overview.items ?? []).forEach((item, index) => {
      ["title", "detail"].forEach((key) => {
        if (!nonEmptyString(item?.[key])) fail(directory, `overview.items[${index}].${key} is required`);
      });
    });
    if (lab.overview.note !== undefined && !nonEmptyString(lab.overview.note)) {
      fail(directory, "overview.note must be a non-empty string when supplied");
    }
  }
  if (lab.proof) {
    ["title", "introduction"].forEach((key) => {
      if (!nonEmptyString(lab.proof?.[key])) fail(directory, `proof.${key} is required`);
    });
    if (!Array.isArray(lab.proof.items) || lab.proof.items.length < 2 || lab.proof.items.some((item) => !nonEmptyString(item?.title) || !nonEmptyString(item?.detail))) {
      fail(directory, "proof.items must contain at least two complete items");
    }
  }
  if (lab.supportGuidance) {
    const support = lab.supportGuidance;
    if (!nonEmptyString(support.title) || !nonEmptyString(support.introduction)) fail(directory, "supportGuidance requires a title and introduction");
    if (!Array.isArray(support.routes) || support.routes.length < 2) fail(directory, "supportGuidance.routes must contain at least two routes");
    (support.routes ?? []).forEach((route, routeIndex) => {
      if (!nonEmptyString(route?.title) || !nonEmptyString(route?.detail)) fail(directory, `supportGuidance.routes[${routeIndex}] requires a title and detail`);
      if (route?.reference) {
        if (!nonEmptyString(route.reference.label)) fail(directory, `supportGuidance.routes[${routeIndex}].reference.label is required`);
        try { new URL(route.reference.href); } catch { fail(directory, `supportGuidance.routes[${routeIndex}].reference.href must be a valid URL`); }
      }
    });
    if (!nonEmptyString(support.diagnostics?.title) || !nonEmptyString(support.diagnostics?.introduction)) fail(directory, "supportGuidance.diagnostics requires a title and introduction");
    if (!Array.isArray(support.diagnostics?.items) || support.diagnostics.items.length < 2) fail(directory, "supportGuidance.diagnostics.items must contain at least two commands");
    (support.diagnostics?.items ?? []).forEach((item, itemIndex) => {
      if (!nonEmptyString(item?.command) || !nonEmptyString(item?.detail)) fail(directory, `supportGuidance.diagnostics.items[${itemIndex}] requires a command and detail`);
    });
  }
  (lab.prerequisites ?? []).forEach((item, index) => {
    ["label", "value", "detail"].forEach((key) => {
      if (!nonEmptyString(item?.[key])) fail(directory, `prerequisites[${index}].${key} is required`);
    });
    if (item?.href) {
      try { new URL(item.href); } catch { fail(directory, `prerequisites[${index}].href must be a valid URL`); }
    }
  });
  (lab.prerequisiteCallouts ?? []).forEach((callout, calloutIndex) => {
    validateGuidanceCallout(callout, `${directory} prerequisiteCallouts[${calloutIndex}]`);
  });
  if (lab.prerequisiteDetails) {
    if (!nonEmptyString(lab.prerequisiteDetails.title)) fail(directory, "prerequisiteDetails.title is required");
    if (!nonEmptyString(lab.prerequisiteDetails.introduction)) fail(directory, "prerequisiteDetails.introduction is required");
    if (!Array.isArray(lab.prerequisiteDetails.items) || lab.prerequisiteDetails.items.length === 0) {
      fail(directory, "prerequisiteDetails.items must contain at least one item");
    }
    (lab.prerequisiteDetails.items ?? []).forEach((callout, calloutIndex) => {
      validateGuidanceCallout(callout, `${directory} prerequisiteDetails.items[${calloutIndex}]`);
    });
  }
  (lab.comparisons ?? []).forEach((comparison, index) => {
    const sourceName = `${directory} comparison ${index + 1}`;
    ["title", "introduction"].forEach((key) => {
      if (!nonEmptyString(comparison?.[key])) fail(sourceName, `${key} is required`);
    });
    if (comparison?.takeaway !== undefined && !nonEmptyString(comparison.takeaway)) fail(sourceName, "takeaway must be a non-empty string when provided");
    if (comparison?.decisionGuide?.label !== undefined && !nonEmptyString(comparison.decisionGuide.label)) fail(sourceName, "decisionGuide.label must be a non-empty string when provided");
    (comparison?.followups ?? []).forEach((followup, followupIndex) => {
      if (!nonEmptyString(followup?.title)) fail(sourceName, `followups[${followupIndex}].title is required`);
      const paragraphsValid = Array.isArray(followup?.paragraphs) && followup.paragraphs.length > 0 && followup.paragraphs.every((paragraph) => nonEmptyString(paragraph));
      const itemsValid = Array.isArray(followup?.items) && followup.items.length > 1 && followup.items.every((item) => nonEmptyString(item?.title) && nonEmptyString(item?.detail));
      if (!paragraphsValid && !itemsValid) fail(sourceName, `followups[${followupIndex}] requires non-empty paragraphs or at least two complete items`);
    });
    (comparison?.notes ?? []).forEach((note, noteIndex) => {
      if (!nonEmptyString(note?.title)) fail(sourceName, `notes[${noteIndex}].title is required`);
      if (!nonEmptyString(note?.detail)) fail(sourceName, `notes[${noteIndex}].detail is required`);
      if (note?.reference) {
        if (!nonEmptyString(note.reference.label)) fail(sourceName, `notes[${noteIndex}].reference.label is required`);
        try { new URL(note.reference.href); } catch { fail(sourceName, `notes[${noteIndex}].reference.href must be a valid URL`); }
      }
    });
    if (!Array.isArray(comparison?.columns) || comparison.columns.length < 1 || comparison.columns.length > 6 || comparison.columns.some((item) => !nonEmptyString(item))) {
      fail(sourceName, "columns must contain between one and six labels");
    }
    if (!Array.isArray(comparison?.rows) || comparison.rows.length < 2) fail(sourceName, "at least two comparison rows are required");
    (comparison?.rows ?? []).forEach((row, rowIndex) => {
      if (!nonEmptyString(row?.aspect)) fail(sourceName, `rows[${rowIndex}].aspect is required`);
      if (!Array.isArray(row?.values) || row.values.length !== comparison.columns.length || row.values.some((item) => !nonEmptyString(item))) {
        fail(sourceName, `rows[${rowIndex}].values must match the number of column labels`);
      }
      if (row?.reference) {
        if (!nonEmptyString(row.reference.label)) fail(sourceName, `rows[${rowIndex}].reference.label is required`);
        try { new URL(row.reference.href); } catch { fail(sourceName, `rows[${rowIndex}].reference.href must be a valid URL`); }
      }
    });
    if (comparison?.decisionGuide) {
      const guide = comparison.decisionGuide;
      ["title", "introduction", "pathTitle"].forEach((key) => {
        if (!nonEmptyString(guide?.[key])) fail(sourceName, `decisionGuide.${key} is required`);
      });
      if (!Array.isArray(guide.options) || guide.options.length < 2 || guide.options.length > 6) {
        fail(sourceName, "decisionGuide.options must contain between two and six options");
      }
      (guide.options ?? []).forEach((option, optionIndex) => {
        ["title", "label", "detail", "bestFor"].forEach((key) => {
          if (!nonEmptyString(option?.[key])) fail(sourceName, `decisionGuide.options[${optionIndex}].${key} is required`);
        });
        if (option?.note !== undefined && !nonEmptyString(option.note)) {
          fail(sourceName, `decisionGuide.options[${optionIndex}].note must be a non-empty string when provided`);
        }
        if (option?.href && !/^#demo-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(option.href)) {
          fail(sourceName, `decisionGuide.options[${optionIndex}].href must target a demo section`);
        }
        if (option?.href && !(lab.demos ?? []).some((demo) => option.href === `#demo-${demo.id}`)) {
          fail(sourceName, `decisionGuide.options[${optionIndex}].href does not match a demo in this HOD`);
        }
        if (option?.href && !nonEmptyString(option.linkLabel)) {
          fail(sourceName, `decisionGuide.options[${optionIndex}].linkLabel is required when href is supplied`);
        }
        if (option?.reference) {
          if (!nonEmptyString(option.reference.label)) fail(sourceName, `decisionGuide.options[${optionIndex}].reference.label is required`);
          try { new URL(option.reference.href); } catch { fail(sourceName, `decisionGuide.options[${optionIndex}].reference.href must be a valid URL`); }
        }
      });
      if (!Array.isArray(guide.path) || guide.path.length < 2 || guide.path.length > 6) {
        fail(sourceName, "decisionGuide.path must contain between two and six decisions");
      }
      (guide.path ?? []).forEach((item, pathIndex) => {
        ["condition", "result"].forEach((key) => {
          if (!nonEmptyString(item?.[key])) fail(sourceName, `decisionGuide.path[${pathIndex}].${key} is required`);
        });
      });
    }
    if (!Array.isArray(comparison?.sources) || comparison.sources.length === 0) fail(sourceName, "at least one official source is required");
    (comparison?.sources ?? []).forEach((source, sourceIndex) => {
      if (!nonEmptyString(source?.label)) fail(sourceName, `sources[${sourceIndex}].label is required`);
      try { new URL(source?.href); } catch { fail(sourceName, `sources[${sourceIndex}].href must be a valid URL`); }
    });
  });

  const demoIds = new Set();
  const demoSteps = [];
  (lab.demos ?? []).forEach((demo, demoIndex) => {
    const sourceName = `${directory} demo ${demoIndex + 1}`;
    ["id", "demoId", "title", "objective", "coverImage", "coverAlt", "duration"].forEach((key) => {
      if (!nonEmptyString(demo?.[key])) fail(sourceName, `${key} is required`);
    });
    if ((demo?.coverAlt ?? "").length < 10) fail(sourceName, "coverAlt must describe the demo artwork");
    if (!slugPattern.test(demo?.id ?? "")) fail(sourceName, "id must contain lowercase words separated by hyphens");
    if (demoIds.has(demo?.id)) fail(sourceName, `duplicate demo id ${demo.id}`);
    demoIds.add(demo?.id);
    if (!demoIdPattern.test(demo?.demoId ?? "")) fail(sourceName, "demoId must use a track-qualified format such as ANSIBLE-HOD-001-D01");
    if (!demo?.demoId?.startsWith(`${lab.hodId}-D`)) fail(sourceName, `demoId must begin with ${lab.hodId}-D`);
    if (demoTrackingIds.has(demo?.demoId)) fail(sourceName, `duplicate demoId ${demo.demoId}`);
    demoTrackingIds.add(demo?.demoId);
    if (!Number.isInteger(demo?.durationMinutes) || demo.durationMinutes < 1) fail(sourceName, "durationMinutes must be a positive integer");
    if (!Array.isArray(demo?.outcomes) || demo.outcomes.length === 0 || demo.outcomes.some((item) => !nonEmptyString(item))) {
      fail(sourceName, "outcomes must preview at least one demonstrable result");
    }
    if (!nonEmptyString(demo?.validationBoundary) || demo.validationBoundary.trim().length < 40) {
      fail(sourceName, "validationBoundary must state what the final check proves and does not prove");
    }
    if (!Array.isArray(demo?.nextActions) || demo.nextActions.length < 2 || demo.nextActions.length > 6 || demo.nextActions.some((item) => !nonEmptyString(item))) {
      fail(sourceName, "nextActions must contain between two and six actionable follow-up items");
    }
    if (demo?.relatedHod) {
      ["title", "detail", "href", "linkLabel"].forEach((key) => {
        if (!nonEmptyString(demo.relatedHod[key])) fail(sourceName, `relatedHod.${key} is required`);
      });
      if (!/^\/demos\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(demo.relatedHod.href ?? "")) {
        fail(sourceName, "relatedHod.href must be a canonical internal HOD route");
      }
    }
    if (!Array.isArray(demo?.steps) || demo.steps.length === 0) fail(sourceName, "steps must contain at least one item");
    if (!Array.isArray(demo?.verification) || demo.verification.length === 0) fail(sourceName, "verification must contain at least one item");
    if (!nonEmptyString(demo?.completionRecord?.introduction)) fail(sourceName, "completionRecord.introduction is required");
    if (!nonEmptyString(demo?.completionRecord?.maintenancePath)) fail(sourceName, "completionRecord.maintenancePath is required");
    if (!Array.isArray(demo?.completionRecord?.items) || demo.completionRecord.items.length < 4) fail(sourceName, "completionRecord.items must contain at least four entries");
    (demo?.completionRecord?.items ?? []).forEach((item, itemIndex) => {
      if (!nonEmptyString(item?.label) || !nonEmptyString(item?.value)) fail(sourceName, `completionRecord.items[${itemIndex}] requires a label and value`);
    });
    (demo?.verification ?? []).forEach((item, index) => {
      if (!nonEmptyString(item)) fail(sourceName, `verification[${index}] must be a non-empty string`);
    });
    if (demo.cleanup && (!nonEmptyString(demo.cleanup.explanation) || !nonEmptyString(demo.cleanup.command))) {
      fail(sourceName, "cleanup must include an explanation and command when supplied");
    }
    (demo?.steps ?? []).forEach((step, stepIndex) => demoSteps.push({ demo, step, stepIndex }));
  });
  (lab.comparisons ?? []).forEach((comparison, index) => {
    if (comparison.afterDemoId && !demoIds.has(comparison.afterDemoId)) {
      fail(`${directory} comparison ${index + 1}`, `afterDemoId does not match a demo id: ${comparison.afterDemoId}`);
    }
  });

  const stepsByCommandSequence = new Map();
  demoSteps.forEach(({ demo, step, stepIndex }) => {
    if (!Array.isArray(step.commands) || step.commands.length === 0) return;
    const commandSequence = JSON.stringify((step.commands ?? []).map((item) => item.command));
    if (!stepsByCommandSequence.has(commandSequence)) stepsByCommandSequence.set(commandSequence, []);
    stepsByCommandSequence.get(commandSequence).push({ demo, step, stepIndex });
    if (!crossLabStepsByCommandSequence.has(commandSequence)) crossLabStepsByCommandSequence.set(commandSequence, []);
    crossLabStepsByCommandSequence.get(commandSequence).push({ directory, demo, step, stepIndex });
  });
  const sharedStepFields = ["label", "title", "alt", "explanation", "expected", "note", "troubleshooting"];
  stepsByCommandSequence.forEach((matchingSteps) => {
    if (new Set(matchingSteps.map(({ demo }) => demo.id)).size < 2) return;
    const baseline = matchingSteps[0];
    const baselineCommandExplanations = baseline.step.commands.map((item) => item.explanation);
    matchingSteps.slice(1).forEach((candidate) => {
      const sourceName = `${directory} demos ${baseline.demo.id} and ${candidate.demo.id}`;
      sharedStepFields.forEach((field) => {
        if ((baseline.step[field] ?? "") !== (candidate.step[field] ?? "")) {
          fail(sourceName, `steps with the same command sequence must use the same ${field}`);
        }
      });
      const candidateCommandExplanations = candidate.step.commands.map((item) => item.explanation);
      if (JSON.stringify(baselineCommandExplanations) !== JSON.stringify(candidateCommandExplanations)) {
        fail(sourceName, "steps with the same command sequence must use the same command explanations");
      }
      if (JSON.stringify(baseline.step.recovery ?? []) !== JSON.stringify(candidate.step.recovery ?? [])) {
        fail(sourceName, "steps with the same command sequence must use the same recovery guidance");
      }
    });
  });

  const demoCoverSet = new Set();
  (lab.demos ?? []).forEach((demo, demoIndex) => {
    const sourceName = `${directory} demo ${demoIndex + 1}`;
    if (demo.coverImage === lab.coverImage) fail(sourceName, "coverImage must differ from the HOD coverImage");
    if (demoCoverSet.has(demo.coverImage)) fail(sourceName, "coverImage must be unique to this demo");
    demoCoverSet.add(demo.coverImage);
    if ((demo.steps ?? []).some((step) => step.image === demo.coverImage)) {
      fail(sourceName, "coverImage must be editorial artwork, not a reused step image");
    }
  });
  const imageAssets = [
    { image: lab.coverImage, label: "coverImage" },
    ...(lab.socialImage ? [{ image: lab.socialImage, label: "socialImage" }] : []),
    ...(lab.demos ?? []).map((demo, index) => ({ image: demo.coverImage, label: `demo ${index + 1} coverImage` })),
    ...demoSteps.map(({ step }, index) => ({ image: step.image, label: `step ${index + 1} image` })),
  ];
  const uniqueImages = new Set();
  let labImageBytes = 0;
  imageAssets.forEach(({ image, label }) => {
    if (!imagePattern.test(image ?? "")) {
      fail(directory, `${label} must be a PNG, JPG, WebP, or SVG path under /demos`);
      return;
    }
    const file = join(publicRoot, image.replace(/^\//, ""));
    if (!existsSync(file)) {
      fail(directory, `${label} does not exist: ${image}`);
      return;
    }
    const bytes = statSync(file).size;
    if (bytes > maxImageBytes) fail(directory, `${label} exceeds the 2 MiB asset budget: ${image}`);
    if (!uniqueImages.has(image)) labImageBytes += bytes;
    uniqueImages.add(image);
    totalImages += 1;
  });
  if (labImageBytes > maxLabImageBytes) fail(directory, `unique screenshots exceed the 12 MiB per-lab asset budget`);
  const stepImagePaths = demoSteps.map(({ step }) => step.image);
  if (new Set(stepImagePaths).size < stepImagePaths.length) warn(directory, "multiple steps reuse the same screenshot");

  demoSteps.forEach(({ demo, step, stepIndex }) => {
    const sourceName = `${directory} demo ${demo.id} step ${stepIndex + 1}`;
    ["label", "title", "alt", "explanation", "expected", "troubleshooting"].forEach((key) => {
      if (!nonEmptyString(step[key])) fail(sourceName, `${key} is required`);
    });
    if (nonEmptyString(step.label) && step.label.trim().split(/\s+/).length < 2) {
      fail(sourceName, "label must be a descriptive action-and-object phrase of at least two words");
    }
    if ((step.alt ?? "").length < 10) fail(sourceName, "alt text must be descriptive");
    if (!Array.isArray(step.commands) || step.commands.length === 0) {
      fail(sourceName, "commands must contain at least one explained command");
    }
    (step.commands ?? []).forEach((item, commandIndex) => {
      if (!nonEmptyString(item?.command)) fail(sourceName, `commands[${commandIndex}].command is required`);
      if (!nonEmptyString(item?.explanation) || item.explanation.trim().length < 20) {
        fail(sourceName, `commands[${commandIndex}].explanation must provide a clear one- or two-line explanation`);
      }
      if (item?.explanation?.trim().length > 240) fail(sourceName, `commands[${commandIndex}].explanation must stay within 240 characters`);
      const normalizedCommand = item?.command?.replace(/\\\s*\n/g, " ") ?? "";
      const shortAdHocModule = normalizedCommand.match(/(?:^|\n)\s*(?:sudo\s+)?ansible\s+[^\n]*?(?:-m\s+|--module-name(?:=|\s+))([a-z_][a-z0-9_]*)(?=\s|$)/i);
      if (shortAdHocModule) {
        fail(sourceName, `commands[${commandIndex}] uses the short module name ${shortAdHocModule[1]}; use its FQCN`);
      }
      const shortDocumentedObject = normalizedCommand.match(/\bansible-doc\b[^\n|;&]*?\s([a-z_][a-z0-9_]*)(?=\s*(?:[|;&]|$))/i);
      if (shortDocumentedObject && !normalizedCommand.includes("ansible-doc --list")) {
        fail(sourceName, `commands[${commandIndex}] uses the short ansible-doc object name ${shortDocumentedObject[1]}; use its FQCN`);
      }
    });
    (step.recovery ?? []).forEach((item, recoveryIndex) => {
      if (!nonEmptyString(item?.symptom)) fail(sourceName, `recovery[${recoveryIndex}].symptom is required`);
      if (!nonEmptyString(item?.detail) || item.detail.trim().length < 20) fail(sourceName, `recovery[${recoveryIndex}].detail must explain the step-specific recovery`);
      if (item.command !== undefined && !nonEmptyString(item.command)) fail(sourceName, `recovery[${recoveryIndex}].command must be non-empty when supplied`);
    });
    if (step.media) {
      if (step.media.type !== "terminal") fail(sourceName, `unsupported media type: ${step.media.type ?? "(missing)"}`);
      const assets = [
        ["terminal source", step.media.source, /\.cast$/i],
        ["transcript", step.media.transcript, /\.txt$/i],
      ];
      assets.forEach(([label, asset, extension]) => {
        if (!nonEmptyString(asset) || !asset.startsWith("/demos/") || !extension.test(asset)) {
          fail(sourceName, `${label} must be a matching file path under /demos`);
          return;
        }
        const file = join(publicRoot, asset.replace(/^\//, ""));
        if (!existsSync(file)) {
          fail(sourceName, `${label} does not exist: ${asset}`);
          return;
        }
        if (label === "terminal source" && statSync(file).size > maxRecordingBytes) {
          fail(sourceName, `${label} exceeds the 1 MiB asset budget: ${asset}`);
        }
        const contents = readFileSync(file, "utf8");
        if (sensitiveRecordingPattern.test(contents)) fail(sourceName, `possible credential, local address, or host identifier found in ${label}`);
        if (label === "terminal source") {
          try {
            const castLines = contents.trimEnd().split("\n");
            const header = JSON.parse(castLines.shift());
            if (!Number.isInteger(header.width) || !Number.isInteger(header.height) || header.width < 1 || header.height < 1) {
              fail(sourceName, "terminal source must declare positive integer width and height values");
            } else {
              const geometry = `${header.width}x${header.height}`;
              if (geometry !== requiredRecordingGeometry) fail(sourceName, `terminal geometry must be ${requiredRecordingGeometry}, found ${geometry}`);
            }
            if (header.version !== 2) fail(sourceName, `terminal source must use asciicast v2, found version ${header.version ?? "(missing)"}`);
            if (typeof header.idle_time_limit !== "number" || header.idle_time_limit <= 0 || header.idle_time_limit > maximumRecordingIdleGap) {
              fail(sourceName, `terminal source idle_time_limit must be between 0 and ${maximumRecordingIdleGap} seconds`);
            }
            let previousOutputEndsWithNewline = true;
            let previousOutputEndsWithVenvPrefix = false;
            let joinedOutput = "";
            let finalOutputTime = 0;
            let lastPromptTime;
            let lastPromptEnd;
            for (const line of castLines) {
              const [time, type, data] = JSON.parse(line);
              if (type !== "o") continue;
              const eventStart = joinedOutput.length;
              finalOutputTime = time;
              for (const match of data.matchAll(/\[rajat@[^\]\r\n]+\][#$] /g)) {
                const offset = match.index ?? 0;
                const followsNewlineInEvent = offset > 0 && /[\r\n]$/.test(data.slice(0, offset));
                const followsVenvPrefix = offset > 0 && /\([^)\r\n]+\) $/.test(data.slice(0, offset));
                const beginsAfterNewline = offset === 0 && previousOutputEndsWithNewline;
                const beginsAfterVenvPrefix = offset === 0 && previousOutputEndsWithVenvPrefix;
                if (!followsNewlineInEvent && !followsVenvPrefix && !beginsAfterNewline && !beginsAfterVenvPrefix) fail(sourceName, "terminal prompt must begin on a new line");
                lastPromptTime = time;
                lastPromptEnd = eventStart + offset + match[0].length;
              }
              joinedOutput += data;
              if (data.length > 0) {
                previousOutputEndsWithNewline = /[\r\n]$/.test(data);
                previousOutputEndsWithVenvPrefix = /\([^)\r\n]+\) $/.test(data);
              }
            }
            const visibleEnding = joinedOutput
              .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "")
              .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "")
              .trimEnd();
            const visibleOutput = joinedOutput
              .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "")
              .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "");
            for (const match of visibleOutput.matchAll(/((?:\r?\n)+)(?=(?:\([^\r\n)]+\) )?\[rajat@[^\]\r\n]+\][#$] )/g)) {
              const lineBreaks = match[1].match(/\n/g)?.length ?? 0;
              if (lineBreaks > 2) {
                fail(sourceName, "terminal source must use exactly one blank row before each returned prompt");
                break;
              }
            }
            if (!/(?:\([^)\r\n]+\) )?\[rajat@[^\]\r\n]+\][#$]$/.test(visibleEnding)) {
              fail(sourceName, "terminal source must end on a returned shell prompt for the rajat demonstration user");
            }
            if (lastPromptEnd !== undefined && joinedOutput.slice(lastPromptEnd).length > 0) {
              fail(sourceName, "terminal source must not emit output or cursor movement after the final prompt");
            }
            if (lastPromptTime === undefined || finalOutputTime - lastPromptTime < minimumCompletionHold) {
              fail(sourceName, `terminal source must hold the final prompt for at least ${minimumCompletionHold} second`);
            }
          } catch {
            fail(sourceName, "terminal source must begin with a valid asciicast JSON header");
          }
        } else {
          for (const match of contents.matchAll(/\[rajat@[^\]\r\n]+\][#$] /g)) {
            const offset = match.index ?? 0;
            const prefix = contents.slice(0, offset);
            const beginsLine = offset === 0 || /[\r\n]$/.test(prefix);
            const followsVenvPrefix = /(?:^|[\r\n])\([^)\r\n]+\) $/.test(prefix);
            if (!beginsLine && !followsVenvPrefix) fail(sourceName, "transcript contains a terminal prompt attached to command output");
          }
          if (!/(?:\([^)\r\n]+\) )?\[rajat@[^\]\r\n]+\][#$]$/.test(contents.trimEnd())) {
            fail(sourceName, "transcript must end on a returned shell prompt for the rajat demonstration user");
          }
          if ((step.commands ?? []).every((item) => !item.command.includes("\n"))) {
            const recordedCommands = [...contents.matchAll(/^(?:\([^\r\n)]*\) )?\[rajat@[^\]\r\n]+\][#$] (.+)$/gm)]
              .map((match) => match[1].trim())
              .filter(Boolean);
            const documentedCommands = step.commands.map((item) => item.command.trim());
            if (JSON.stringify(recordedCommands) !== JSON.stringify(documentedCommands)) {
              fail(sourceName, "transcript command sequence must exactly match the documented commands");
            }
          }
        }
      });
      totalRecordings += 1;
    }
  });
  totalSteps += demoSteps.length;

  const raw = JSON.stringify(lab);
  if (/VNC Password|SSH Password|192\.168\.\d+\.\d+|password\s*=/i.test(raw)) fail(directory, "possible credential or local address found in lab data");

}

const crossLabSharedFields = ["label", "title", "alt", "explanation", "expected", "note", "troubleshooting"];
crossLabStepsByCommandSequence.forEach((matchingSteps) => {
  if (new Set(matchingSteps.map(({ directory }) => directory)).size < 2) return;
  const baseline = matchingSteps[0];
  const baselineCommandExplanations = baseline.step.commands.map((item) => item.explanation);
  matchingSteps.slice(1).forEach((candidate) => {
    const sourceName = `${baseline.directory}/${baseline.demo.id} and ${candidate.directory}/${candidate.demo.id}`;
    crossLabSharedFields.forEach((field) => {
      if ((baseline.step[field] ?? "") !== (candidate.step[field] ?? "")) {
        fail(sourceName, `cross-HOD steps with the same command sequence must use the same ${field}`);
      }
    });
    if (JSON.stringify(baselineCommandExplanations) !== JSON.stringify(candidate.step.commands.map((item) => item.explanation))) {
      fail(sourceName, "cross-HOD steps with the same command sequence must use the same command explanations");
    }
    if (JSON.stringify(baseline.step.recovery ?? []) !== JSON.stringify(candidate.step.recovery ?? [])) {
      fail(sourceName, "cross-HOD steps with the same command sequence must use the same recovery guidance");
    }
  });
});

warnings.forEach((message) => console.warn(`WARN ${message}`));
if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  console.error(`Lab validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Validated ${directories.length} lab(s), ${totalSteps} step(s), ${totalImages} referenced image(s), and ${totalRecordings} terminal replay(s).`);
