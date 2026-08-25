# Browser and mobile support

Rajat’s Applied Technology Lab supports the modern-browser baseline documented for Next.js 16:

| Browser family | Minimum supported version |
| --- | ---: |
| Google Chrome | 111 |
| Microsoft Edge | 111 |
| Mozilla Firefox | 111 |
| Apple Safari | 16.4 |
| Mobile Safari on iOS/iPadOS | 16.4 |
| Chrome on Android | Uses the current Android Chrome engine |

The production target is declared in `package.json` through Browserslist. Next.js uses this configuration when compiling JavaScript and CSS.

## Required release checks

Every change to global navigation, content cards, the author profile, or the lab player must be checked at these viewport widths:

- 320 × 568: narrow phone
- 390 × 844: current phone
- 768 × 1024: tablet portrait
- 1024 × 768: tablet landscape or compact laptop
- 1440 × 900: desktop

For each viewport, verify:

1. No horizontal page overflow.
2. The primary menu can be opened and every destination remains reachable.
3. Buttons and links have visible keyboard focus and usable touch targets.
4. Long titles wrap without clipping.
5. Code, tables, terminal content, and comparison content scroll inside their own containers.
6. The lab player keeps its header, progress, media, instructions, and footer usable.
7. The page remains understandable when animations are reduced.

## Progressive enhancements

- Fullscreen is shown only when the browser exposes the standard Fullscreen API. The player remains fully usable without it, including on mobile Safari configurations that restrict element fullscreen.
- Clipboard failures produce a manual-copy instruction instead of blocking the lab.
- Local storage is optional. Labs remain usable when private browsing or policy blocks storage.
- Terminal recordings always include a static screenshot and text transcript fallback.
- `100vh` precedes `100svh` so browsers without small-viewport units retain a usable player height.
- Safe-area insets protect controls on notched phones and tablets.

## Automation

Run the source-level compatibility gate with:

```bash
pnpm validate:browsers
```

`pnpm build` runs this gate automatically. It confirms the declared browser baseline and guards against removing required Safari, mobile viewport, touch, storage, clipboard, and fullscreen fallbacks.

Visual checks still matter. Browser engines can differ in font metrics, native controls, fullscreen policy, and viewport behavior even when compilation succeeds.
