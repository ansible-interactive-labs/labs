import { readFileSync, writeFileSync } from "node:fs";

const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  console.error("Usage: node scripts/cast-to-transcript.mjs <recording.cast> <transcript.txt>");
  process.exit(1);
}

const lines = readFileSync(source, "utf8").trimEnd().split("\n");
lines.shift();
const terminalOutput = lines.map((line) => JSON.parse(line)).filter((event) => event[1] === "o").map((event) => event[2]).join("");
const withoutControls = terminalOutput
  .replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "")
  .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "")
  .replace(/\u001b\([A-Z0-9]/g, "");

const transcriptLines = withoutControls.split("\n").flatMap((line) => {
  const overwritten = line.split("\r").filter(Boolean);
  const visible = overwritten.at(-1)?.trimEnd() ?? "";
  return visible ? [visible] : [""];
});

const compact = [];
for (const line of transcriptLines) {
  if (line === compact.at(-1) && /^[|/\\-] /.test(line)) continue;
  if (!line && !compact.at(-1)) continue;
  compact.push(line);
}
while (!compact.at(-1)) compact.pop();

writeFileSync(destination, compact.join("\n") + "\n");
console.log(`Wrote ${destination}`);
