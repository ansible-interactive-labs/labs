import { cache } from "react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Lab, LabDemo, LabDemoFile, LabManifest, LabSummary } from "./types";

const labsDirectory = join(process.cwd(), "content", "labs");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const demoFilePattern = /^demos\/[a-z0-9]+(?:-[a-z0-9]+)*\.json$/;
const supportedTopics = new Set(["Ansible", "RHEL"]);
const topicIdPrefixes = { Ansible: "ANSIBLE", RHEL: "RHEL" } as const;

const labFile = (slug: string) => join(labsDirectory, slug, "lab.json");

const assertDemo = (value: unknown, source: string, hodId: string): LabDemo => {
  if (!value || typeof value !== "object") throw new Error(`${source}: demo data must be an object`);
  const demoFile = value as Partial<LabDemoFile>;
  if (demoFile.schemaVersion !== 1) throw new Error(`${source}: unsupported demo schemaVersion`);
  if (demoFile.hodId !== hodId) throw new Error(`${source}: hodId must match ${hodId}`);
  if (typeof demoFile.demoId !== "string" || !demoFile.demoId.startsWith(`${hodId}-D`)) {
    throw new Error(`${source}: demoId must belong to ${hodId}`);
  }
  if (!Array.isArray(demoFile.steps) || demoFile.steps.length === 0) throw new Error(`${source}: at least one step is required`);
  if (!Array.isArray(demoFile.verification) || demoFile.verification.length === 0) throw new Error(`${source}: verification checks are required`);
  const demo = { ...demoFile } as Partial<LabDemoFile>;
  delete demo.$schema;
  delete demo.schemaVersion;
  delete demo.hodId;
  return demo as LabDemo;
};

const assertLabManifest = (value: unknown, source: string): LabManifest => {
  if (!value || typeof value !== "object") throw new Error(`${source}: lab data must be an object`);
  const lab = value as Partial<LabManifest>;
  if ("demos" in lab) throw new Error(`${source}: demos must be stored in separate files and referenced through demoFiles`);
  const requiredStrings: Array<keyof LabManifest> = ["hodId", "slug", "title", "shortDescription", "description", "coverImage", "coverAlt", "duration", "difficulty", "topic", "platform", "status"];
  requiredStrings.forEach((key) => {
    if (typeof lab[key] !== "string" || !(lab[key] as string).trim()) throw new Error(`${source}: ${String(key)} is required`);
  });
  if (!supportedTopics.has(lab.topic ?? "")) throw new Error(`${source}: topic must be Ansible or RHEL`);
  const expectedHodId = lab.topic && lab.hodNumber
    ? `${topicIdPrefixes[lab.topic]}-HOD-${String(lab.hodNumber).padStart(3, "0")}`
    : "";
  if (lab.hodId !== expectedHodId) throw new Error(`${source}: hodId must match its technology track and hodNumber (${expectedHodId})`);
  if (lab.schemaVersion !== 3) throw new Error(`${source}: unsupported schemaVersion`);
  if (!slugPattern.test(lab.slug ?? "")) throw new Error(`${source}: slug must use lowercase words separated by hyphens`);
  if (!Array.isArray(lab.demoFiles)) throw new Error(`${source}: demoFiles must be an array`);
  if (lab.status === "Available" && lab.demoFiles.length === 0) throw new Error(`${source}: an available HOD requires at least one demo file`);
  if (new Set(lab.demoFiles).size !== lab.demoFiles.length) throw new Error(`${source}: demoFiles must be unique`);
  lab.demoFiles.forEach((file, index) => {
    if (typeof file !== "string" || !demoFilePattern.test(file)) {
      throw new Error(`${source}: demoFiles[${index}] must match demos/<slug>.json`);
    }
  });
  if (!Array.isArray(lab.prerequisites) || lab.prerequisites.length === 0) throw new Error(`${source}: prerequisites are required`);
  return lab as LabManifest;
};

export const getLabSlugs = cache(() => readdirSync(labsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(labFile(entry.name)))
  .map((entry) => entry.name)
  .sort());

export const getLab = cache((slug: string): Lab | undefined => {
  if (!slugPattern.test(slug)) return undefined;
  const source = labFile(slug);
  if (!existsSync(source)) return undefined;
  const manifest = assertLabManifest(JSON.parse(readFileSync(source, "utf8")), source);
  const demos = manifest.demoFiles.map((relativePath) => {
    const demoSource = join(labsDirectory, slug, relativePath);
    if (!existsSync(demoSource)) throw new Error(`${source}: missing demo file ${relativePath}`);
    return assertDemo(JSON.parse(readFileSync(demoSource, "utf8")), demoSource, manifest.hodId);
  });
  return { ...manifest, demos };
});

export const getLabSummaries = cache((): LabSummary[] => getLabSlugs()
  .map((slug) => getLab(slug))
  .filter((lab): lab is Lab => Boolean(lab))
  .map((lab) => ({
    hodId: lab.hodId,
    slug: lab.slug,
    title: lab.title,
    shortDescription: lab.shortDescription,
    description: lab.description,
    coverImage: lab.coverImage,
    coverAlt: lab.coverAlt,
    duration: lab.duration,
    durationMinutes: lab.durationMinutes,
    difficulty: lab.difficulty,
    topic: lab.topic,
    platform: lab.platform,
    status: lab.status,
    hodNumber: lab.hodNumber,
    publishedOrder: lab.publishedOrder,
    tags: lab.tags,
    outcomes: lab.outcomes,
    stepCount: lab.demos.reduce((count, demo) => count + demo.steps.length, 0),
    demoCount: lab.demos.length,
    plannedDemos: lab.plannedDemos
  }))
  .sort((a, b) => a.publishedOrder - b.publishedOrder || a.title.localeCompare(b.title)));
