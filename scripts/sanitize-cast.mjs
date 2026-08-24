import { readFileSync, writeFileSync } from "node:fs";

const source = process.argv[2];
if (!source) {
  console.error("Usage: node scripts/sanitize-cast.mjs <recording.cast>");
  process.exit(1);
}

const lines = readFileSync(source, "utf8").trimEnd().split("\n");
const header = JSON.parse(lines.shift());
delete header.command;
delete header.timestamp;

const events = lines.map((line) => JSON.parse(line));
const clearIndex = events.findIndex((event) => event[1] === "o" && event[2].includes("clear\r\n"));
const visibleEvents = clearIndex >= 0 ? events.slice(clearIndex + 1) : events;
const exitIndex = visibleEvents.findIndex((event) => event[1] === "o" && event[2].startsWith("exit\r\n"));
const trimmedEvents = exitIndex >= 0 ? visibleEvents.slice(0, exitIndex) : visibleEvents;
const firstTime = trimmedEvents[0]?.[0] ?? 0;
const rebasedEvents = trimmedEvents.map(([time, type, data]) => [
  Math.max(0, Number((time - firstTime).toFixed(6))),
  type,
  data
]);

const output = [JSON.stringify(header), ...rebasedEvents.map((event) => JSON.stringify(event))].join("\n") + "\n";
const sensitivePatterns = [
  /192\.168\.\d+\.\d+/i,
  /password\s+for/i,
  /\/tmp\/ansible-lab/i,
  /machine id/i,
  /boot id/i
];
const match = sensitivePatterns.find((pattern) => pattern.test(output));
if (match) {
  console.error(`${source}: possible private data remains after sanitization (${match})`);
  process.exit(1);
}

writeFileSync(source, output);
console.log(`Sanitized ${source}: ${rebasedEvents.length} visible event(s)`);
