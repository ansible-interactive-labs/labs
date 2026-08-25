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
const promptPattern = /\[(?:rajat|learner)@[^\]\r\n]+\][#$] /g;
let previousOutputEndsWithNewline = true;
let previousOutputEndsWithVenvPrefix = false;
const rebasedEvents = trimmedEvents.map(([time, type, data]) => {
  let normalizedData = data;
  if (type === "o") {
    // RHEL's versioned venv activation template can render its label as
    // `((name) )`. Normalize only that prompt decoration for a clean replay;
    // the environment name and all command output remain unchanged.
    const promptNormalizedData = data
      .replace(/\(\(([^)\r\n]+)\) \) /g, "($1) ")
      .replace(/(\([^)\r\n]+\) )\r?\n(?=\[rajat@)/g, "$1");
    normalizedData = promptNormalizedData.replace(promptPattern, (prompt, offset) => {
      const followsNewlineInEvent = offset > 0 && /[\r\n]$/.test(promptNormalizedData.slice(0, offset));
      const followsVenvPrefix = offset > 0 && /\([^)\r\n]+\) $/.test(promptNormalizedData.slice(0, offset));
      const beginsAfterNewline = offset === 0 && previousOutputEndsWithNewline;
      const beginsAfterVenvPrefix = offset === 0 && previousOutputEndsWithVenvPrefix;
      return followsNewlineInEvent || followsVenvPrefix || beginsAfterNewline || beginsAfterVenvPrefix ? prompt : `\r\n${prompt}`;
    });
    previousOutputEndsWithNewline = /[\r\n]$/.test(normalizedData);
    previousOutputEndsWithVenvPrefix = /\([^)\r\n]+\) $/.test(normalizedData);
  }
  return [Math.max(0, Number((time - firstTime).toFixed(6))), type, normalizedData];
});

// Freeze the published replay on the final returned prompt. Stopping a shell
// can emit bracketed-paste resets, carriage returns, or newlines after that
// prompt; those teardown bytes move the visible cursor onto an empty line.
let finalPromptEventIndex = -1;
let finalPromptEnd = -1;
rebasedEvents.forEach((event, index) => {
  if (event[1] !== "o") return;
  const matches = [...event[2].matchAll(/\[(?:rajat|learner)@[^\]\r\n]+\][#$] /g)];
  const finalMatch = matches.at(-1);
  if (!finalMatch) return;
  finalPromptEventIndex = index;
  finalPromptEnd = (finalMatch.index ?? 0) + finalMatch[0].length;
});
if (finalPromptEventIndex >= 0) {
  rebasedEvents[finalPromptEventIndex][2] = rebasedEvents[finalPromptEventIndex][2].slice(0, finalPromptEnd);
  for (let index = finalPromptEventIndex + 1; index < rebasedEvents.length; index += 1) {
    if (rebasedEvents[index][1] === "o") rebasedEvents[index][2] = "";
  }
  const completionHoldTime = Number((rebasedEvents[finalPromptEventIndex][0] + 1.25).toFixed(6));
  const finalEvent = rebasedEvents.at(-1);
  if (!finalEvent || finalEvent[0] < completionHoldTime) {
    rebasedEvents.push([completionHoldTime, "o", ""]);
  }
}

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
