# Ansible Automation Lab

A static, replay-led learning site for Ansible demonstrations. Learners watch each verified workflow, read an accessible transcript, copy the commands, and complete the hands-on activity in their own RHEL environment.

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
  --idle-time-limit 2 \
  --title "STEP TITLE" \
  public/demos/DEMO-SLUG/recordings/STEP-NAME.cast
```

Do not enable `--capture-input`; it can record passwords and other sensitive keyboard input. The lab validator rejects recordings that are not asciicast v2 or do not use the required 120×34 geometry.

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

- A dedicated, shareable URL and device-local progress tracking
- A single Start lab action before launch and a viewport-contained lab mode with fixed navigation and independently scrollable guidance
- Searchable topic, platform, difficulty, tags, duration, and learning outcomes
- Explicit OS, privilege, connectivity, subscription, and registry prerequisites
- A tested environment record and visible last-verified date
- Sanitized terminal replays with text transcripts, screenshot fallbacks, meaningful alternative text, and no private data
- Copyable commands, expected results, and per-step troubleshooting
- Keyboard, touch, mobile, reduced-motion, and screen-reader support
- A functional verification step, completion checklist, and optional cleanup
- Step-specific and general GitHub issue-reporting links

Before publishing, check the homepage and lab route at desktop, tablet, and phone widths; exercise the Start lab gate, fixed lab frame, independently scrolling guidance, replay controls, transcripts, step navigation, saved progress, completion, reset, search, filters, screenshot fallbacks, and issue links.

Keep secrets, account names, subscription identifiers, IP addresses, passwords, machine IDs, and boot IDs out of recordings, transcripts, screenshots, and source files.
