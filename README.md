# Rajat’s Applied Technology Lab

A static professional technology portfolio, learning platform, and solution library created by Rajat Agrawal. The platform begins with verified Ansible Hands-On Demos and is designed to expand across automation, infrastructure as code, Kubernetes, developer platforms, cloud, security, and applied AI.

**Master brand promise:** Learn it. Build it. Apply it.

**Hands-On Demo promise:** Watch it. Run it. Verify it.

Each published lab receives a stable `HOD NNN` identifier. Public website attribution uses the exact creator name **Rajat Agrawal** and links to [Rajat on LinkedIn](https://www.linkedin.com/in/connectwithrajat/). The project is independent and is not affiliated with or endorsed by Red Hat.

The information architecture separates three content families—`HOD` Hands-On Demos, `SOL` Solutions, and `CASE` Consulting Cases—and connects each family through a shared technology directory. The dedicated author profile at `/author/rajat-agrawal/` connects Rajat’s professional focus, teaching approach, and public LinkedIn profile to the complete platform.

HOD 001 covers three independently playable ways to install `ansible-core` on RHEL 9:

1. Install the Red Hat-provided ansible-core RPM from RHEL AppStream and validate it locally.
2. Install a compatible RHEL Python, create a virtual environment, and install upstream ansible-core from PyPI without installing the RHEL ansible-core RPM.
3. Install a compatible RHEL Python and use pipx to install upstream ansible-core from PyPI in an application-specific environment.

The introduction keeps three compatibility decisions separate: the RHEL 9 AppStream RPM/runtime combination, upstream ansible-core control-node and managed-node Python support, and Red Hat Ansible Automation Platform execution-environment coverage. Each matrix links to its official lifecycle or compatibility source.

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

## Optional aggregate analytics

HOD pages emit a small, provider-neutral event set for page views, installation-path selections, demo starts, demo completions, official-reference links, next-HOD links, and author-profile links. The payload contains the event name, page path, HOD ID, and relevant demo or link label. It does not create a learner account, persistent session identifier, or browser cookie, and it is not emitted when the browser enables Global Privacy Control or Do Not Track.

Analytics is disabled unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is configured. The endpoint must accept JSON `POST` requests. GitHub Pages builds read the optional `ANALYTICS_ENDPOINT` repository variable. When an existing analytics integration supplies `window.plausible`, the same anonymous events are also forwarded through that function. Provider-side IP handling, retention, consent, and regional requirements remain the site owner's responsibility.

Search indexing is disabled by default while the platform is in testing. The static build emits site-wide `noindex` metadata, blocks crawlers in `robots.txt`, and leaves the sitemap empty. A future production launch must deliberately set `SITE_INDEXING_ENABLED=true` at build time and update the Pages workflow before search engines are invited to index the site.

## Publish with GitHub Pages

1. Push this project to the `main` branch of a GitHub repository.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. The included `deploy-pages.yml` workflow builds and publishes the site automatically.

The workflow detects whether the repository is a root site (`owner.github.io`) or a project site and configures the asset path accordingly.

## Browser and mobile support

The project explicitly targets Chrome 125+, Edge 125+, Firefox 124+, Safari 17.3+, and the latest Mobile Safari and Chrome for Android releases. Responsive release checks cover narrow phones, current phones, tablets, compact laptops, and desktops. See [`docs/BROWSER_SUPPORT.md`](docs/BROWSER_SUPPORT.md) for the support contract, progressive-enhancement behavior, and QA checklist.

## Add another HOD or demo

1. Create one directory per HOD at `content/labs/<hod-slug>/`. Copy an existing `lab.json` manifest and `review.md`, then update every field. The HOD manifest is validated by `schema.json` and must not contain embedded demo objects.
2. Create each demonstration as an independent `content/labs/<hod-slug>/demos/<demo-slug>.json` file validated by `demo.schema.json`. Add its relative path to the HOD manifest's ordered `demoFiles` array.
3. Create `public/demos/<hod-slug>/assets/` and `public/demos/<hod-slug>/recordings/` as needed.
4. Create a dedicated 16:9 editorial cover for every demo module. A demo cover must represent that module's specific workflow, differ from the HOD cover, differ from every other demo cover in the HOD, and never reuse a step screenshot. This rule also applies when the HOD contains only one demo.
5. Record every terminal workflow while signed in as the public demonstration user `rajat`, using an asciicast v2 file at exactly 120 columns × 34 rows. Generate a text transcript and retain a clean 16:9 screenshot as a resilient fallback. Use sequential names and reference all media from the applicable demo JSON.
6. Give every step a concise, descriptive action-and-object label of at least two words, such as `Check Repositories` or `Verify Installation`; avoid single-word labels such as `Check` or `Verify`. Follow it with an introduction that explains the step's purpose and context without narrating individual commands. Store each learner-visible command separately with its own one- or two-line explanation, then include the expected result and troubleshooting guidance.
7. Use the fully qualified collection name for every Ansible module, plugin, role, and other collection-provided object whenever an FQCN exists. Apply this rule to commands, prose, headings, alternative text, expected results, and troubleshooting—for example, write `ansible.builtin.ping`, not `ping` or `the built-in ping module`.
8. Treat a repeated ordered command sequence as one shared instructional step, whether it appears in two demos within the same HOD or in different HODs. Reuse the same step label, heading, alternative text, introduction, command explanations, expected result, note, troubleshooting summary, and recovery guidance. Only the replay and fallback image may differ when the environment shown is different. If the shared wording is inaccurate for one workflow, improve the canonical wording for every occurrence instead of creating a local variation.
9. Review every demo title and Start Demo objective against the complete recorded workflow. Review every top-bar label, step heading, introduction, expected result, note, per-step recovery message, and general troubleshooting item against the commands and replay before publishing.
10. Do not add a per-step Restart Demo action. Closing or refreshing an anonymous demo resets it; the next launch begins at step 1.
11. Record the tested OS, architecture, and package or image version.
12. Complete the instructional audit in `docs/LAB_CONTENT_REVIEW.md`, including the mandatory Technical Support Engineer, Solution Architect / Pre-Sales, Technical Consultant, Instructor, Student, Technical Marketing Manager, Technical Account Manager, and Sales perspectives. Save the findings as `content/labs/<hod-slug>/review.md` and share them even when no gaps are found.
13. Add a source-backed `comparisons` block whenever learners may confuse related tools, packages, commands, or support models. Begin an ansible-core decision with the collections, platforms, and dependencies the automation requires. For a dependent choice, use `decisionGuide` to present the next decision without duplicating the first comparison. Use `followups` for short post-decision guardrails or validation boundaries that apply to the comparison as a whole.
14. Keep every HOD independently useful. Do not add a linear next-step card or imply that learners must follow the HODs in sequence. When another published HOD is materially relevant, use an optional related-content link and describe it as an alternative or deeper reference rather than the required next lesson.
15. Follow the enforced **Preview → Practice → Prove** structure. Give each demo outcomes and verification criteria, state its validation boundary, record its maintenance path, provide actionable next steps, and add an HOD-level recap with at least three durable takeaways.
16. Sanitize recordings with `node scripts/sanitize-cast.mjs <file.cast>`, then run `pnpm validate:labs`, `pnpm lint`, and `pnpm build`. Test the exported root and dedicated demo route over local HTTP.
17. Assign every HOD to exactly one technology-specific track through its `topic` field. The currently approved technology tracks are `Ansible` and `RHEL`. Number HODs independently inside each track and include that track in every public identifier: `ANSIBLE-HOD-001`, `ANSIBLE-HOD-002`, and `RHEL-HOD-001`. Demo IDs inherit the complete HOD ID, such as `RHEL-HOD-001-D01`. The catalog automatically includes every HOD in the default `All` filter, so do not duplicate `All` in lab metadata. Do not introduce another track without deliberately extending the schema, loader, catalog options, validator, and review standard together.

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

Record every published terminal session while signed in as the public demonstration user `rajat` and preserve `[rajat@HOSTNAME]` prompts as intentional creator branding. Write learner-visible commands with portable home-directory notation such as `$HOME` or `~`; do not hardcode `/home/rajat` into commands that learners are expected to copy. Command output may naturally resolve those expressions to `/home/rajat`, and that resolved output should remain visible as authentic recorded evidence. In explanations, expected results, verification criteria, completion records, and cleanup guidance, use portable notation or explicitly label an absolute path as the recording's example. Continue removing passwords, private IP addresses, account and subscription identifiers, machine IDs, boot IDs, and credential prompts.

Immediately before every recording session, configure the demonstration shell behind the scenes with `export PROMPT_COMMAND='printf "\\n"'`. Do not include this preparation command in the learner-visible step. It ensures every prompt starts on a fresh line even when a command omits its trailing newline. Sanitization repairs attached prompts, reduces excess prompt spacing to one blank terminal row, and removes terminal teardown output after the final prompt. Validation rejects casts or transcripts where command output and the next prompt share a line, casts with more than one blank row before a returned prompt, and casts that move the cursor away from the final prompt before playback ends.

No central registry or route file needs to be edited. The build discovers each `lab.json`, validates required content and assets, creates its static route, and adds it to the sitemap automatically.

## Architecture for a large lab library

- Each HOD is an independent content unit under `content/labs/<slug>/lab.json`, so contributors do not edit a growing site-wide monolithic file. A shared dynamic route renders these manifests consistently; individual HOD page components are unnecessary.
- Every demonstration is an independent file under `content/labs/<slug>/demos/`. The HOD manifest controls display order through `demoFiles`, while each demo owns its steps, verification, troubleshooting, completion record, and optional cleanup.
- The homepage ships compact `LabSummary` records only. Demo files are hydrated only when the associated HOD is loaded.
- The catalog searches and sorts the summaries, but renders only 12 cards initially and reveals additional groups on demand.
- Build-time validation rejects duplicate tracking IDs or slugs, invalid metadata, unexplained step commands, missing assets, screenshots above the 2 MiB budget, recordings above the 1 MiB budget, terminal recordings that are not asciicast v2 at 120×34, incomplete instructional fields, and likely private data in lab JSON, replays, or transcripts.
- Every lab directory must contain a review report, preventing a structurally valid but instructionally incomplete lab from entering the build unnoticed.
- Static routes and `sitemap.xml` are generated from discovered labs. Adding lab 101 follows exactly the same workflow as adding lab 2.
- HOD manifests and demo files follow the versioned schemas in `content/labs/schema.json` and `content/labs/demo.schema.json`, allowing future content migrations without coupling content to UI components.
- Optional comparison records render as accessible, mobile-scrollable tables with a practical decision takeaway and official references.
- Reusable `prerequisiteCallouts` keep subscription, entitlement, and package-source explanations separate from concise prerequisite cards; comparison `followups` hold guardrails and validation boundaries without hard-coding them into a page component.
- Optional related-content links can connect materially relevant HODs without imposing a course sequence or implying that one demo is required before another.
- Demo modules can override the lab-level outcomes, so each Start Demo screen remains accurate as a single HOD grows to include multiple installation or operating-system workflows.

## Lab publishing standard

Every published lab must include:

- A dedicated, shareable URL and stateless anonymous sessions that always begin at step 1
- One or more independently playable demo modules, each with a single Start Demo action and a viewport-contained player with fixed navigation and independently scrollable guidance
- Searchable topic, platform, difficulty, tags, duration, and learning outcomes
- Explicit OS, privilege, connectivity, subscription, and registry prerequisites
- Separate prerequisite callouts when learners need to distinguish product access, package provenance, or entitlement requirements
- A tested environment record covering the operating system, architecture, and package or image version
- Sanitized terminal replays branded with the `rajat` demonstration user, with text transcripts, screenshot fallbacks, meaningful alternative text, and no private infrastructure or credential data
- A fixed 120×34 terminal canvas that fills the available media pane at desktop, tablet, and phone sizes without decorative inset padding
- Copyable commands, expected results, and per-step troubleshooting
- Keyboard, touch, mobile, reduced-motion, and screen-reader support
- A functional final step, an integrated completion summary, contextual recovery guidance, and optional in-player cleanup
- An enforced Preview → Practice → Prove sequence with visible success criteria, a validation boundary, maintenance ownership, next actions, and an HOD-level recap
- Step-specific and general GitHub issue-reporting links

Before publishing, check the homepage and lab route at desktop, tablet, and phone widths; exercise the Start Demo gate, fixed lab frame, independently scrolling guidance, replay controls, transcripts, step navigation, completion, fresh-start behavior after exit or refresh, search, filters, screenshot fallbacks, and issue links.

Keep secrets, account names, subscription identifiers, IP addresses, passwords, machine IDs, and boot IDs out of recordings, transcripts, screenshots, and source files.
