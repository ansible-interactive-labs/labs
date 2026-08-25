import { cache } from "react";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Lab, LabSummary } from "./types";

const labsDirectory = join(process.cwd(), "content", "labs");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const labFile = (slug: string) => join(labsDirectory, slug, "lab.json");

const assertLab = (value: unknown, source: string): Lab => {
  if (!value || typeof value !== "object") throw new Error(`${source}: lab data must be an object`);
  const lab = value as Partial<Lab>;
  const requiredStrings: Array<keyof Lab> = ["slug", "title", "shortDescription", "description", "coverImage", "coverAlt", "duration", "difficulty", "topic", "platform", "status"];
  requiredStrings.forEach((key) => {
    if (typeof lab[key] !== "string" || !(lab[key] as string).trim()) throw new Error(`${source}: ${String(key)} is required`);
  });
  if (lab.schemaVersion !== 1) throw new Error(`${source}: unsupported schemaVersion`);
  if (!slugPattern.test(lab.slug ?? "")) throw new Error(`${source}: slug must use lowercase words separated by hyphens`);
  if (!Array.isArray(lab.steps) || lab.steps.length === 0) throw new Error(`${source}: at least one step is required`);
  if (!Array.isArray(lab.troubleshooting) || lab.troubleshooting.length === 0) throw new Error(`${source}: troubleshooting is required`);
  if (!Array.isArray(lab.prerequisites) || lab.prerequisites.length === 0) throw new Error(`${source}: prerequisites are required`);
  if (!Array.isArray(lab.completion) || lab.completion.length === 0) throw new Error(`${source}: completion checks are required`);
  return lab as Lab;
};

export const getLabSlugs = cache(() => readdirSync(labsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(labFile(entry.name)))
  .map((entry) => entry.name)
  .sort());

export const getLab = cache((slug: string): Lab | undefined => {
  if (!slugPattern.test(slug)) return undefined;
  const source = labFile(slug);
  if (!existsSync(source)) return undefined;
  return assertLab(JSON.parse(readFileSync(source, "utf8")), source);
});

export const getLabSummaries = cache((): LabSummary[] => getLabSlugs()
  .map((slug) => getLab(slug))
  .filter((lab): lab is Lab => Boolean(lab))
  .map((lab) => ({
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
    stepCount: lab.steps.length,
    verifiedDate: lab.verified.date,
    verifiedDateISO: lab.verified.dateISO
  }))
  .sort((a, b) => a.publishedOrder - b.publishedOrder || a.title.localeCompare(b.title)));
