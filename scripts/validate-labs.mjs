import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const labsRoot = join(root, "content", "labs");
const publicRoot = join(root, "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /^\/demos\/.+\.(png|jpe?g|webp)$/i;
const maxImageBytes = 2 * 1024 * 1024;
const maxLabImageBytes = 12 * 1024 * 1024;
const maxRecordingBytes = 1024 * 1024;
const requiredRecordingGeometry = "120x34";
const sensitiveRecordingPattern = /(?:VNC|SSH) Password|192\.168\.\d+\.\d+|password\s*=|\[sudo\] password|machine-id|boot-id/i;
const errors = [];
const warnings = [];

const fail = (source, message) => errors.push(`${source}: ${message}`);
const warn = (source, message) => warnings.push(`${source}: ${message}`);
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const directories = readdirSync(labsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(labsRoot, entry.name, "lab.json")))
  .map((entry) => entry.name)
  .sort();

if (!directories.length) fail("content/labs", "at least one lab directory is required");

const slugs = new Set();
const titles = new Set();
const orders = new Set();
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
    ["## Readiness", "## Findings", "## Comparison review", "## Learner experience"].forEach((heading) => {
      if (!review.includes(heading)) fail(directory, `review.md must include ${heading}`);
    });
  }
  let lab;
  try {
    lab = JSON.parse(readFileSync(source, "utf8"));
  } catch (error) {
    fail(directory, `invalid JSON (${error.message})`);
    continue;
  }

  if (lab.schemaVersion !== 1) fail(directory, "schemaVersion must be 1");
  if (!slugPattern.test(lab.slug ?? "")) fail(directory, "slug must contain lowercase words separated by hyphens");
  if (lab.slug !== directory) fail(directory, `directory name must match slug ${lab.slug ?? "(missing)"}`);
  if (slugs.has(lab.slug)) fail(directory, `duplicate slug ${lab.slug}`);
  slugs.add(lab.slug);

  ["title", "shortDescription", "description", "coverImage", "coverAlt", "duration", "topic", "platform", "status"].forEach((key) => {
    if (!nonEmptyString(lab[key])) fail(directory, `${key} is required`);
  });
  if (titles.has(lab.title)) fail(directory, `duplicate title ${lab.title}`);
  titles.add(lab.title);

  if (!Number.isInteger(lab.durationMinutes) || lab.durationMinutes < 1) fail(directory, "durationMinutes must be a positive integer");
  if (!Number.isInteger(lab.publishedOrder) || lab.publishedOrder < 0) fail(directory, "publishedOrder must be a non-negative integer");
  if (orders.has(lab.publishedOrder)) warn(directory, `publishedOrder ${lab.publishedOrder} is shared with another lab`);
  orders.add(lab.publishedOrder);
  if (!["Beginner", "Intermediate", "Advanced"].includes(lab.difficulty)) fail(directory, "difficulty is invalid");
  if (!["Available", "Coming soon"].includes(lab.status)) fail(directory, "status is invalid");

  ["tags", "outcomes", "prerequisites", "steps", "troubleshooting", "completion"].forEach((key) => {
    if (!Array.isArray(lab[key]) || lab[key].length === 0) fail(directory, `${key} must contain at least one item`);
  });
  if (!lab.cleanup || !nonEmptyString(lab.cleanup.explanation) || !nonEmptyString(lab.cleanup.command)) fail(directory, "cleanup explanation and command are required");
  if (!lab.verified || !nonEmptyString(lab.verified.dateISO) || Number.isNaN(Date.parse(lab.verified.dateISO))) fail(directory, "verified.dateISO must be a valid date");
  ["date", "os", "architecture", "package"].forEach((key) => {
    if (!nonEmptyString(lab.verified?.[key])) fail(directory, `verified.${key} is required`);
  });

  ["tags", "outcomes", "completion"].forEach((key) => {
    (lab[key] ?? []).forEach((item, index) => {
      if (!nonEmptyString(item)) fail(directory, `${key}[${index}] must be a non-empty string`);
    });
  });
  (lab.prerequisites ?? []).forEach((item, index) => {
    ["label", "value", "detail"].forEach((key) => {
      if (!nonEmptyString(item?.[key])) fail(directory, `prerequisites[${index}].${key} is required`);
    });
    if (item?.href) {
      try { new URL(item.href); } catch { fail(directory, `prerequisites[${index}].href must be a valid URL`); }
    }
  });
  (lab.troubleshooting ?? []).forEach((item, index) => {
    ["title", "command", "detail"].forEach((key) => {
      if (!nonEmptyString(item?.[key])) fail(directory, `troubleshooting[${index}].${key} is required`);
    });
  });
  (lab.comparisons ?? []).forEach((comparison, index) => {
    const sourceName = `${directory} comparison ${index + 1}`;
    ["title", "introduction", "takeaway"].forEach((key) => {
      if (!nonEmptyString(comparison?.[key])) fail(sourceName, `${key} is required`);
    });
    if (!Array.isArray(comparison?.columns) || comparison.columns.length !== 2 || comparison.columns.some((item) => !nonEmptyString(item))) {
      fail(sourceName, "columns must contain exactly two labels");
    }
    if (!Array.isArray(comparison?.rows) || comparison.rows.length < 2) fail(sourceName, "at least two comparison rows are required");
    (comparison?.rows ?? []).forEach((row, rowIndex) => {
      if (!nonEmptyString(row?.aspect)) fail(sourceName, `rows[${rowIndex}].aspect is required`);
      if (!Array.isArray(row?.values) || row.values.length !== 2 || row.values.some((item) => !nonEmptyString(item))) {
        fail(sourceName, `rows[${rowIndex}].values must contain exactly two explanations`);
      }
    });
    if (!Array.isArray(comparison?.sources) || comparison.sources.length === 0) fail(sourceName, "at least one official source is required");
    (comparison?.sources ?? []).forEach((source, sourceIndex) => {
      if (!nonEmptyString(source?.label)) fail(sourceName, `sources[${sourceIndex}].label is required`);
      try { new URL(source?.href); } catch { fail(sourceName, `sources[${sourceIndex}].href must be a valid URL`); }
    });
  });

  const imagePaths = [lab.coverImage, ...(lab.steps ?? []).map((step) => step.image)];
  const uniqueImages = new Set();
  let labImageBytes = 0;
  imagePaths.forEach((image, index) => {
    const label = index === 0 ? "coverImage" : `step ${index} image`;
    if (!imagePattern.test(image ?? "")) {
      fail(directory, `${label} must be a PNG, JPG, or WebP path under /demos`);
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
  if (uniqueImages.size < imagePaths.length - 1) warn(directory, "multiple steps reuse the same screenshot");

  (lab.steps ?? []).forEach((step, index) => {
    const sourceName = `${directory} step ${index + 1}`;
    ["label", "title", "alt", "explanation", "expected", "troubleshooting"].forEach((key) => {
      if (!nonEmptyString(step[key])) fail(sourceName, `${key} is required`);
    });
    if ((step.alt ?? "").length < 10) fail(sourceName, "alt text must be descriptive");
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
            const header = JSON.parse(contents.split("\n", 1)[0]);
            if (!Number.isInteger(header.width) || !Number.isInteger(header.height) || header.width < 1 || header.height < 1) {
              fail(sourceName, "terminal source must declare positive integer width and height values");
            } else {
              const geometry = `${header.width}x${header.height}`;
              if (geometry !== requiredRecordingGeometry) fail(sourceName, `terminal geometry must be ${requiredRecordingGeometry}, found ${geometry}`);
            }
            if (header.version !== 2) fail(sourceName, `terminal source must use asciicast v2, found version ${header.version ?? "(missing)"}`);
          } catch {
            fail(sourceName, "terminal source must begin with a valid asciicast JSON header");
          }
        }
      });
      totalRecordings += 1;
    }
  });
  totalSteps += lab.steps?.length ?? 0;

  const raw = JSON.stringify(lab);
  if (/VNC Password|SSH Password|192\.168\.\d+\.\d+|password\s*=/i.test(raw)) fail(directory, "possible credential or local address found in lab data");

  if (lab.verified?.dateISO) {
    const ageDays = Math.floor((Date.now() - Date.parse(lab.verified.dateISO)) / 86400000);
    if (ageDays > 365) warn(directory, `verification is ${ageDays} days old`);
  }
}

warnings.forEach((message) => console.warn(`WARN ${message}`));
if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  console.error(`Lab validation failed with ${errors.length} error(s).`);
  process.exit(1);
}

console.log(`Validated ${directories.length} lab(s), ${totalSteps} step(s), ${totalImages} referenced image(s), and ${totalRecordings} terminal replay(s).`);
