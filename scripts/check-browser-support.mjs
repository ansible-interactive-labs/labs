import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), "utf8");
const packageJson = JSON.parse(read("package.json"));
const css = read("app/globals.css");
const player = read("components/DemoPlayer.tsx");
const layout = read("app/layout.tsx");

const requiredTargets = ["chrome 111", "edge 111", "firefox 111", "safari 16.4", "ios_saf 16.4"];
const missingTargets = requiredTargets.filter((target) => !packageJson.browserslist?.includes(target));
if (missingTargets.length) throw new Error(`Missing browser targets: ${missingTargets.join(", ")}`);

const requirements = [
  [css.includes("-webkit-backdrop-filter"), "Safari backdrop-filter prefix"],
  [css.includes("height: 100vh") && css.includes("height: 100svh"), "viewport-height fallback"],
  [css.includes("safe-area-inset-bottom") && css.includes("safe-area-inset-left"), "mobile safe-area support"],
  [css.includes("-webkit-overflow-scrolling: touch"), "momentum touch scrolling"],
  [css.includes("touch-action: manipulation"), "touch interaction optimization"],
  [player.includes("fullscreenSupported"), "progressive fullscreen detection"],
  [player.includes("navigator.clipboard") && player.includes("Copy failed"), "clipboard failure fallback"],
  [player.includes("localStorage") && player.includes("progressive enhancement"), "storage progressive enhancement"],
  [layout.includes("viewportFit: 'cover'"), "mobile viewport safe-area metadata"],
];

const missing = requirements.filter(([present]) => !present).map(([, label]) => label);
if (missing.length) throw new Error(`Browser-support safeguards missing: ${missing.join(", ")}`);

console.log(`Validated browser baseline: ${requiredTargets.join(", ")}.`);
console.log(`Validated ${requirements.length} compatibility and mobile safeguards.`);
