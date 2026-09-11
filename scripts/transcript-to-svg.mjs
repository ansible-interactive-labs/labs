import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const [transcriptPath, destinationPath, title = "Terminal replay"] = process.argv.slice(2);
if (!transcriptPath || !destinationPath) {
  console.error("Usage: node scripts/transcript-to-svg.mjs <transcript.txt> <fallback.svg> [title]");
  process.exit(1);
}

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const rawLines = readFileSync(transcriptPath, "utf8").trimEnd().split("\n");
const maximumLines = 27;
const displayLines = rawLines.length <= maximumLines
  ? rawLines
  : [rawLines[0], "…", ...rawLines.slice(-(maximumLines - 2))];
const lineHeight = 27;
const text = displayLines.map((line, index) => {
  const clipped = line.length > 112 ? `${line.slice(0, 109)}…` : line;
  const color = line.startsWith("[rajat@") || line.startsWith("> ") ? "#ff8d80" : "#e8e4ea";
  return `<text x="68" y="${134 + index * lineHeight}" fill="${color}">${escapeXml(clipped || " ")}</text>`;
}).join("\n    ");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(title)}</title>
  <desc id="desc">Static fallback generated from ${escapeXml(basename(transcriptPath))}</desc>
  <defs>
    <linearGradient id="terminal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#17151a"/>
      <stop offset="1" stop-color="#252129"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="#0d0c10"/>
  <rect x="24" y="24" width="1552" height="852" rx="22" fill="url(#terminal)" stroke="#49434c" stroke-width="2"/>
  <circle cx="66" cy="66" r="9" fill="#ff5f57"/>
  <circle cx="96" cy="66" r="9" fill="#febc2e"/>
  <circle cx="126" cy="66" r="9" fill="#28c840"/>
  <text x="800" y="72" fill="#bdb6c0" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22">${escapeXml(title)}</text>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="20">
    ${text}
  </g>
</svg>
`;

writeFileSync(destinationPath, svg);
console.log(`Wrote ${destinationPath}`);
