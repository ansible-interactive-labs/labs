import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

if (process.env.SITE_INDEXING_ENABLED === "true") {
  console.log("Search indexing is enabled; staging indexing checks skipped.");
  process.exit(0);
}

const outputDirectory = "out";
const robots = readFileSync(join(outputDirectory, "robots.txt"), "utf8");
const sitemap = readFileSync(join(outputDirectory, "sitemap.xml"), "utf8");

if (!/^User-Agent: \*\s+Disallow: \/\s*$/m.test(robots)) {
  throw new Error("Staging robots.txt must disallow every crawler from the entire site.");
}

if (/<url>/i.test(sitemap)) {
  throw new Error("The staging sitemap must not publish any URLs.");
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith(".html") ? [path] : [];
  });
}

const missingNoindex = htmlFiles(outputDirectory).filter((file) => {
  const html = readFileSync(file, "utf8");
  return !html.includes('<meta name="robots" content="noindex') || !html.includes('<meta name="googlebot" content="noindex');
});

if (missingNoindex.length) {
  throw new Error(`Staging pages missing noindex metadata: ${missingNoindex.join(", ")}`);
}

console.log("Validated crawler blocking, empty sitemap, and site-wide noindex metadata for staging.");
