import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const labsRoot = join(root, "content", "labs");
const publicRoot = join(root, "public");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imagePattern = /^\/demos\/.+\.(png|jpe?g|webp)$/i;
const maxImageBytes = 2 * 1024 * 1024;
const maxLabImageBytes = 12 * 1024 * 1024;
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

for (const directory of directories) {
  const source = join(labsRoot, directory, "lab.json");
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

console.log(`Validated ${directories.length} lab(s), ${totalSteps} step(s), and ${totalImages} referenced image(s).`);
