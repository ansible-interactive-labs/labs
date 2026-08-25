# Rajat’s Applied Technology Lab

A static professional technology portfolio, learning platform, and solution library created by Rajat Agrawal. The platform begins with verified Ansible Hands-On Demos and is designed to expand across automation, infrastructure as code, Kubernetes, developer platforms, cloud, security, and applied AI.

**Master brand promise:** Learn it. Build it. Apply it.

**Hands-On Demo promise:** Watch it. Run it. Verify it.

Each published lab receives a stable `HOD NNN` identifier. Public website attribution uses the exact creator name **Rajat Agrawal** and links to [Rajat on LinkedIn](https://www.linkedin.com/in/connectwithrajat/). The project is independent and is not affiliated with or endorsed by Red Hat.

The information architecture separates three content families—`HOD` Hands-On Demos, `SOL` Solutions, and `CASE` Consulting Cases—and connects each family through a shared technology directory. The dedicated author profile at `/author/rajat-agrawal/` connects Rajat’s professional focus, teaching approach, and public LinkedIn profile to the complete platform.

The first demo covers installing `ansible-core` on RHEL 9:

1. Verify the RHEL 9 environment and disconnected starting state.
2. Register it with `rhc connect` and confirm the result.
3. Compare the Subscription Management and DNF repository views.
4. Inspect the supported `ansible-core` package.
5. Install it with DNF.
6. Verify the package files, commands, and runtime.
7. Inspect the active Ansible configuration and module documentation.
8. Run a functional localhost smoke test.

Red Hat credentials are never stored in this repository or shown in recordings, transcripts, or screenshots.

## Run locally

Requirements: Node.js 22 or later and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Build the static site

```bash
pnpm validate:labs
pnpm validate:browsers
pnpm build
```

The deployable site is generated in `out/`. To test the production output locally:

```bash
python3 -m http.server 8080 --directory out
```

## Publish with GitHub Pages

1. Push this project to the `main` branch of a GitHub repository.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included `deploy-pages.yml` workflow builds and publishes the site automatically.

The workflow detects whether the repository is a root site (`owner.github.io`) or a project site and configures the asset path accordingly.

## Browser and mobile support

The project explicitly targets Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+, and iOS Safari 16.4+. Responsive release checks cover narrow phones, current phones, tablets, compact laptops, and desktops. See [`docs/BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md) for the support contract, progressive-enhancement behavior, and QA checklist.

## Add another demo

1. Copy an existing `content/labs/<demo-slug>/lab.json` into a new directory and update every field. The included `schema.json` provides editor validation.
2. Create `public/demos/<demo-slug>/assets/`.
3. Record every terminal workflow as an asciicast v2 file at exactly 120 columns × 34 rows, generate a text transcript, and retain a clean 16:9 screenshot as a resilient fallback. Use sequential names and reference all media from the lab JSON.
4. Include a command, plain-language explanation, expected result, and troubleshooting guidance for every meaningful action.
5. Record the tested OS, architecture, package or image version, and verification date.
6. Complete the instructional audit in `docs/LAB_CONTENT_REVIEW.md`, save the findings as `content/labs/<demo-slug>/review.md`, and share them even when no gaps are found.
7. Add a source-backed `comparisons` block whenever learners may confuse related tools, packages, commands, or support models.
8. Sanitize recordings with `node scripts/sanitize-cast.mjs <file.cast>`, then run `pnpm validate:labs`, `pnpm lint`, and `pnpm build`. Test the exported root and dedicated demo route over local HTTP.

Use this recording command for every terminal step:

```bash
asciinema record \
  --output-format asciicast-v2 \
  --window-size 120x34 \
  --idle-time-limit 1.25 \
  --title "STEP TITLE" \
  public/demos/DEMO-SLUG/recordings/STEP-NAME.cast
```

Do not enable `--capture-input`; it can record passwords and other sensitive keyboard input. The lab validator rejects recordings that are not asciicast v2 or do not use the required 120×34 geometry.

When `asciinema` is unavailable on the demonstration VM, capture output and timing with the RHEL `script` utility, without input logging, and convert the pair locally:

```bash
stty cols 120 rows 34
script -q -m advanced -O /tmp/STEP.out -T /tmp/STEP.time
# After each command, wait for the returned prompt and hold it briefly. Type exit only after the final hold.
node scripts/script-to-cast.mjs /tmp/STEP.out /tmp/STEP.time public/demos/DEMO-SLUG/recordings/STEP.cast
node scripts/sanitize-cast.mjs public/demos/DEMO-SLUG/recordings/STEP.cast
node scripts/cast-to-transcript.mjs public/demos/DEMO-SLUG/recordings/STEP.cast public/demos/DEMO-SLUG/recordings/STEP.txt
```

Never add `--log-in` or `--log-io`; either option can retain credential input. The converter removes terminal wrapper metadata and macOS/GNOME control sequences, replaces interactive credential fields with neutral placeholders, preserves command/output ordering, caps silent gaps at 1.25 seconds, and holds on the final returned prompt before playback ends.

Record every published terminal session while signed in as the public demonstration user `rajat`. Preserve `[rajat@HOSTNAME]` prompts and `/home/rajat` paths as intentional creator branding. Continue removing passwords, private IP addresses, account and subscription identifiers, machine IDs, boot IDs, and credential prompts.

Before recording, configure the demonstration shell with `export PROMPT_COMMAND='printf "\\n"'`. This ensures every prompt starts on a fresh line even when a command omits its trailing newline. Sanitization repairs attached prompts as a fallback, and validation rejects any cast or transcript where command output and the next prompt share a line.

No central registry or route file needs to be edited. The build discovers each `lab.json`, validates required content and assets, creates its static route, and adds it to the sitemap automatically.

## Architecture for a large lab library

- Each lab is an independent content unit under `content/labs/<slug>/lab.json`, so contributors do not edit a growing monolithic file.
- The homepage ships compact `LabSummary` records only. Full steps, commands, troubleshooting, and completion content are sent only on that lab's dedicated route.
- The catalog searches and sorts the summaries, but renders only 12 cards initially and reveals additional groups on demand.
- Build-time validation rejects duplicate slugs, invalid metadata, missing assets, screenshots above the 2 MiB budget, recordings above the 1 MiB budget, terminal recordings that are not asciicast v2 at 120×34, incomplete instructional fields, and likely private data in lab JSON, replays, or transcripts.
- Every lab directory must contain a review report, preventing a structurally valid but instructionally incomplete lab from entering the build unnoticed.
- Static routes and `sitemap.xml` are generated from discovered labs. Adding lab 101 follows exactly the same workflow as adding lab 2.
- Lab JSON follows the versioned schema in `content/labs/schema.json`, allowing future content migrations without coupling content to UI components.
- Optional comparison records render as accessible, mobile-scrollable tables with a practical decision takeaway and official references.

## Lab publishing standard

Every published lab must include:

- A dedicated, shareable URL and stateless anonymous sessions that always begin at step 1
- A single Start Demo action before launch and a viewport-contained lab mode with fixed navigation and independently scrollable guidance
- Searchable topic, platform, difficulty, tags, duration, and learning outcomes
- Explicit OS, privilege, connectivity, subscription, and registry prerequisites
- A tested environment record and visible last-verified date
- Sanitized terminal replays branded with the `rajat` demonstration user, with text transcripts, screenshot fallbacks, meaningful alternative text, and no private infrastructure or credential data
- A fixed 120×34 terminal canvas that fills the available media pane at desktop, tablet, and phone sizes without decorative inset padding
- Copyable commands, expected results, and per-step troubleshooting
- Keyboard, touch, mobile, reduced-motion, and screen-reader support
- A functional verification step, completion checklist, and optional cleanup
- Step-specific and general GitHub issue-reporting links

Before publishing, check the homepage and lab route at desktop, tablet, and phone widths; exercise the Start Demo gate, fixed lab frame, independently scrolling guidance, replay controls, transcripts, step navigation, completion, fresh-start behavior after exit or refresh, search, filters, screenshot fallbacks, and issue links.

Keep secrets, account names, subscription identifiers, IP addresses, passwords, machine IDs, and boot IDs out of recordings, transcripts, screenshots, and source files.
