# Ansible Automation Lab

A static, screenshot-led learning site for Ansible demonstrations. Learners watch each verified workflow, copy the commands, and complete the hands-on activity in their own RHEL environment.

The first demo covers installing `ansible-core` on RHEL 9:

1. Prepare an updated RHEL 9 host.
2. Register it with `rhc connect`.
3. Verify BaseOS and AppStream repositories.
4. Inspect the supported `ansible-core` package.
5. Install it with DNF.
6. Validate the installed package and runtime.
7. Run a functional localhost smoke test.

Red Hat credentials are never stored in this repository or shown in the screenshots.

## Run locally

Requirements: Node.js 22 or later and pnpm 10.

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Build the static site

```bash
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

1. Create `public/demos/<demo-slug>/assets/`.
2. Add clean 16:9 screenshots with sequential names such as `01-prepare.png`.
3. Add one complete `Lab` record to `content/labs.ts`. The catalog and dedicated static route are generated from that record.
4. Include a command, plain-language explanation, expected result, and troubleshooting guidance for every meaningful action.
5. Record the tested OS, architecture, package or image version, and verification date.
6. Run `pnpm lint` and `pnpm build`, then test the exported root and dedicated demo route over local HTTP.

## Lab publishing standard

Every published lab must include:

- A dedicated, shareable URL and device-local progress tracking
- Searchable topic, platform, difficulty, tags, duration, and learning outcomes
- Explicit OS, privilege, connectivity, subscription, and registry prerequisites
- A tested environment record and visible last-verified date
- Sequential screenshots with meaningful alternative text and no private data
- Copyable commands, expected results, and per-step troubleshooting
- Keyboard, touch, mobile, reduced-motion, and screen-reader support
- A functional verification step, completion checklist, and optional cleanup
- Step-specific and general GitHub issue-reporting links

Before publishing, check the homepage and lab route at desktop, tablet, and phone widths; exercise step navigation, saved progress, completion, reset, search, filters, full-size screenshots, and issue links.

Keep secrets, account names, subscription identifiers, IP addresses, and passwords out of screenshots and source files.
