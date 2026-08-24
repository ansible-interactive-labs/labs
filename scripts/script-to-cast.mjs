import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { StringDecoder } from "node:string_decoder";

const [outputSource, timingSource, destination] = process.argv.slice(2);
if (!outputSource || !timingSource || !destination) {
  console.error("Usage: node scripts/script-to-cast.mjs <script.out> <script.time> <recording.cast>");
  process.exit(1);
}

const output = readFileSync(outputSource);
const timingLines = readFileSync(timingSource, "utf8").trim().split("\n");
const timing = timingLines.flatMap((line) => {
  const fields = line.trim().split(/\s+/);
  if (fields[0] === "O") return [{ delay: Number(fields[1]), bytes: Number(fields[2]) }];
  if (/^\d+(?:\.\d+)?$/.test(fields[0]) && /^\d+$/.test(fields[1])) {
    return [{ delay: Number(fields[0]), bytes: Number(fields[1]) }];
  }
  return [];
});

if (!timing.length) throw new Error(`${timingSource}: no output timing records found`);
const recordedBytes = timing.reduce((total, entry) => total + entry.bytes, 0);
if (recordedBytes > output.length) {
  throw new Error(`${timingSource}: timing references ${recordedBytes} bytes but output contains ${output.length}`);
}

const firstNewline = output.indexOf(0x0a);
const footerMarker = Buffer.from("\nScript done on ");
const footerIndex = output.lastIndexOf(footerMarker);
const visibleStart = firstNewline >= 0 ? firstNewline + 1 : 0;
const visibleEnd = footerIndex >= 0 ? footerIndex : recordedBytes;
const decoder = new StringDecoder("utf8");
const events = [];
let offset = 0;
let elapsed = 0;
let inOsc = false;
let oscEscape = false;
let pendingEscape = false;

function stripOsc(text) {
  let clean = "";
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (inOsc) {
      if (character === "\u0007") {
        inOsc = false;
        oscEscape = false;
      } else if (oscEscape && character === "\\") {
        inOsc = false;
        oscEscape = false;
      } else {
        oscEscape = character === "\u001b";
      }
      continue;
    }
    if (pendingEscape) {
      pendingEscape = false;
      if (character === "]") {
        inOsc = true;
        oscEscape = false;
        continue;
      }
      clean += "\u001b";
    }
    if (character === "\u001b") {
      pendingEscape = true;
      continue;
    }
    clean += character;
  }
  return clean;
}

for (const entry of timing) {
  elapsed += entry.delay;
  const chunkStart = offset;
  const chunkEnd = offset + entry.bytes;
  offset = chunkEnd;
  if (chunkEnd <= visibleStart || chunkStart >= visibleEnd) continue;
  const start = Math.max(chunkStart, visibleStart);
  const end = Math.min(chunkEnd, visibleEnd);
  const decoded = decoder.write(output.subarray(start, end));
  const clean = stripOsc(decoded).replaceAll("\u001b(B", "");
  if (clean) events.push([Number(elapsed.toFixed(6)), "o", clean]);
}

let tail = stripOsc(decoder.end()).replaceAll("\u001b(B", "");
if (pendingEscape && !inOsc) tail += "\u001b";
if (tail) events.push([Number(elapsed.toFixed(6)), "o", tail]);

function replaceAcrossEvents(pattern, replacement) {
  const originalData = events.map((event) => event[2]);
  const starts = [];
  let cursor = 0;
  for (const data of originalData) {
    starts.push(cursor);
    cursor += data.length;
  }
  const joined = originalData.join("");
  const edits = originalData.map(() => []);
  for (const match of joined.matchAll(pattern)) {
    const matchStart = match.index ?? 0;
    const matchEnd = matchStart + match[0].length;
    for (let index = 0; index < originalData.length; index += 1) {
      const eventStart = starts[index];
      const eventEnd = eventStart + originalData[index].length;
      if (eventEnd <= matchStart || eventStart >= matchEnd) continue;
      edits[index].push({
        start: Math.max(0, matchStart - eventStart),
        end: Math.min(originalData[index].length, matchEnd - eventStart),
        replacement: eventStart <= matchStart && matchStart < eventEnd ? replacement : "",
      });
    }
  }
  for (let index = 0; index < events.length; index += 1) {
    let data = originalData[index];
    for (const edit of edits[index].sort((left, right) => right.start - left.start)) {
      data = data.slice(0, edit.start) + edit.replacement + data.slice(edit.end);
    }
    events[index][2] = data;
  }
}

replaceAcrossEvents(/\[sudo\] password for [^:\r\n]+: /g, "Authentication completed securely\r\n");
replaceAcrossEvents(/Username: [^\r\n]*/g, "Username: [entered securely]");
replaceAcrossEvents(/Password: [^\r\n]*\r?\n/g, "Password: [entered securely]\r\n");

const visibleEvents = events.filter((event) => event[2]);
const firstTime = visibleEvents[0]?.[0] ?? 0;
for (const event of visibleEvents) event[0] = Number(Math.max(0, event[0] - firstTime).toFixed(6));
if ((visibleEvents.at(-1)?.[0] ?? 0) < 3) visibleEvents.push([3, "o", ""]);

const header = {
  version: 2,
  width: 120,
  height: 34,
  idle_time_limit: 2,
  title: basename(destination, ".cast").replace(/^\d+-/, "").replaceAll("-", " "),
  env: { SHELL: "/bin/bash", TERM: "xterm-256color" },
};
writeFileSync(destination, [JSON.stringify(header), ...visibleEvents.map((event) => JSON.stringify(event))].join("\n") + "\n");
console.log(`Converted ${outputSource} to ${destination} (${visibleEvents.length} events)`);
