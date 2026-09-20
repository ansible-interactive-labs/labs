# Installing ansible-core content review

## Readiness

Ready. Three complete installation workflows were recorded on reset RHEL 9 environments: the Red Hat-provided AppStream RPM, upstream ansible-core from PyPI in a manually created Python 3.12 virtual environment, and upstream ansible-core in a pipx-managed environment. All three reach their stated outcomes with compatibility guidance, provenance checks, content-boundary inspection, functional verification, troubleshooting, transcripts, fallbacks, and cleanup.

## Findings

Implemented in this review:

- Consolidated the separate distribution and installation-method comparisons into one pre-demo “Choose your ansible-core installation path” section. It now separates the provider and support decision from the environment-management decision, retains the pipx runtime boundary, and removes repeated source, ownership, version, and support guidance.

- Rewrote the Core concept introduction in direct language while retaining “minimal automation engine” as the primary definition of `ansible-core`.
- Revised all five capability cards to explain what learners receive and how built-in `ansible.builtin` content differs from collections installed separately.
- Replaced the “Keep in mind” aside with explicit development and production guidance that applies to both demonstrations in HOD 001.
- Moved shared Ansible operations and `ansible-navigator` into visually independent sections so the Core concept remains focused on defining `ansible-core`.
- Simplified the Automation Controller, AWX, Semaphore UI, and Rundeck descriptions while preserving their different scopes and support models.
- Rewrote the Red Hat Developer access callout in direct learner-focused language while retaining the distinction between repository access and product support for user-created automation.
- Renamed the distribution comparison to “RHEL-provided ansible-core vs upstream ansible-core” so it remains concise without confusing the AppStream RPM with the ansible-core versions included in Ansible Automation Platform.
- Kept the comparison introduction focused on the two ansible-core distribution paths instead of listing individual demonstrations. Demo-specific installation methods remain with their respective modules.
- Reduced the comparison from eleven overlapping rows to seven decision-focused rows and added explicit guidance against mixing pip-owned packages with RHEL's RPM-managed platform Python.
- Moved shared capabilities and package-access guidance into reusable comparison notes, removed unrelated AWX and Automation Controller references, and added stacked comparison cards for narrow screens.
- Kept the visible package-access note brief and moved Red Hat's documented coverage, examples, and source link into the detailed Support coverage row. Comparison rows now accept an optional reference link for future HODs.
- Removed the “When to use it” comparison row because it repeated the visible “Which should you choose?” guidance below the table.
- Added Demo 02 for upstream ansible-core installed with pip from PyPI. The RHEL subscription supplies only the supported Python 3.12 prerequisite; ansible-core itself is installed from PyPI into `/home/rajat/.venvs/ansible-core-2.21`.
- Made Demo 02 independently runnable by adding the same RHEL registration, connection-confirmation, and enabled-repository steps used by Demo 01 before checking the Python packages.
- Made the no-cost learner path explicit in a dedicated access callout beneath the lab prerequisites and on the homepage: eligible individuals can join Red Hat Developer for free and obtain the self-supported Developer Subscription for Individuals used to access RHEL and applicable BaseOS/AppStream repositories. The call to action links directly to Red Hat Developer registration.
- Kept the prerequisite cards focused on actionable environment requirements by moving the longer subscription explanation into a reusable lab-level access callout. The callout preserves the distinction between repository access and broader Ansible Automation Platform product support.
- Added a source-backed upstream Python matrix covering the complete published 2.10–2.21 history, with distinct control-node and managed-host ranges plus lifecycle status. Version 2.10 is correctly identified as `ansible-base`, and each lifecycle milestone occupies its own visual line instead of being compressed into semicolon-separated prose. This prevents pip from silently selecting an obsolete release merely to fit RHEL 9's default Python 3.9.
- Brought the upstream PyPI matrix into the same managed-host structure as the RHEL matrix: separate Linux/Unix and Windows columns, platform guidance cards, stacked requirements, historical .NET baselines, and the PowerShell 7.6 LTS option introduced with ansible-core 2.21.
- Replaced split Python 2 and Python 3 managed-host entries with a single “or” expression in each historical row. These are alternative supported interpreter ranges, not simultaneous installation requirements; the same ambiguity was removed from the ansible-base 2.10 and ansible-core 2.11 control-node cells.
- Replaced the demo-specific “How to use this matrix” takeaway with a concise “Choose a maintained combination” rule: select a maintained ansible-core release before matching control-node and managed-host Python, rather than choosing an end-of-life release merely because it accepts an older interpreter.
- Rewrote the upstream-distribution introduction around the completed section: PyPI provenance, control-node Python, Linux/Unix Python, Windows PowerShell and .NET, network-device exceptions, and the distinction between technical compatibility and active maintenance.
- Clarified in both runtime matrices that an SSH connection account needs sudo permission, or another configured become method, only for tasks that must run as root; unprivileged tasks do not require sudo.
- Renamed the upstream matrix label to “Upstream Python distribution”; the introduction identifies PyPI as the publication source without treating it as the artifact type.
- Replaced the HOD-specific RHEL 9 matrix with a reusable RHEL 8, 9, and 10 compatibility table covering the AppStream ansible-core stream, RPM-selected control-node Python, Linux/Unix Python and SSH prerequisites, and Windows PowerShell, .NET Framework, and WinRM prerequisites.
- Removed the highlighted “Read the version correctly” note. Its lifecycle distinction now appears once in the introduction, while official references render independently below comparisons with or without a takeaway.
- Expanded the RHEL runtime introduction to distinguish feature streams from exact RPM builds and identify the table as an ansible-core baseline that collections and modules can narrow. Added separate guidance for POSIX hosts, Windows hosts, and network devices so transport- and platform-specific requirements are not repeated in every version row.
- Rendered multi-part managed-host requirements as stacked items with dividers, making runtime and connection requirements easy to distinguish without adding more columns.
- Added an explicit “Managed-host requirements by platform” heading above the Linux/Unix, Windows, and network-device cards so they cannot be mistaken for control-node requirements.
- Removed the Ansible Automation Platform supported-combinations matrix because HOD 001 covers only the RHEL AppStream RPM and upstream Python distribution. AAP releases, execution environments, and their compatibility policy belong in the future ansible-navigator or execution-environment HOD.
- Used the distribution terms “Red Hat-provided ansible-core RPM,” “upstream ansible-core from PyPI,” and “community-maintained upstream release.” Avoided the ambiguous phrase “community Ansible,” which can be mistaken for the separate `ansible` Python package.
- Recorded installation of `python3.12` and `python3.12-pip` with DNF, creation of a Python 3.12 virtual environment, installation of upstream `ansible-core` 2.21.4, and activation/deactivation behavior.
- Proved package provenance: no `ansible-core` RPM is installed in Demo 02, both Python and Ansible resolve inside the virtual environment, pip reports no broken requirements, and `ansible --version` reports core 2.21.4 on Python 3.12.14.
- Verified the upstream content boundary, `ansible.builtin` documentation namespace, localhost `ping: pong` smoke test, and shell-scoped virtual-environment activation.
- Added demo-specific learning outcomes so each independent Start Demo screen describes only the workflow the learner is about to run.
- Replaced all nine Demo 02 screenshot fallbacks with terminal-player end states and confirmed that each replay returns to a fresh `[rajat@demo]` prompt on its own line.
- Added Demo 03 for upstream ansible-core installed with pipx on RHEL 9. The workflow records Python 3.12 installation, user-scoped pipx installation, persistent PATH configuration, application-environment creation, provenance checks, content inspection, and a functional localhost test.
- Confirmed that pipx 1.17.2 installed ansible-core 2.21.4 with Python 3.12.14 under `/home/rajat/.local/share/pipx/venvs/ansible-core`, while the launcher resolves through `/home/rajat/.local/bin` and no ansible-core RPM is installed.
- Prevented the empty collection-path warning by creating the standard user collection directory before running `ansible-galaxy collection list`. The empty result and 71 embedded module-documentation entries are explained separately.
- Used an explicit `/usr/bin/python3` managed-host interpreter in the localhost test, removing the interpreter-discovery warning without changing the pipx-managed control-node runtime.
- Added a reusable transcript-to-SVG fallback generator so future terminal demonstrations can provide crisp, lightweight evidence without copying an unrelated screenshot.
- Audited collection-provided content across all three demonstrations and replaced shortened `ping` module wording with the `ansible.builtin.ping` FQCN in commands, explanations, expected results, and alternative text. The publishing checklist now requires FQCNs for modules, plugins, roles, and other collection objects whenever one exists.

- Replaced the introductory comparison with a source-backed deep dive limited to the RHEL 9 AppStream and upstream `ansible-core` distributions.
- Explained their shared core capabilities and their different artifact formats, installation ownership, runtime integration, version strategies, maintenance windows, security practices, lifecycles, and compatibility tradeoffs.
- Corrected the support description: a RHEL entitlement grants repository access, but RHEL support for this RPM is limited to automation supplied or generated by Red Hat products. Broader support for the core platform and core-maintained modules requires Ansible Automation Platform.
- Documented why the RHEL RPM version can remain on 2.14 while fixes are backported, and why Red Hat advisories—not only the upstream version number—must be used for security assessment.
- Removed all discussion of the separately distributed community `ansible` package because it is outside this lab's comparison scope.
- Added a reusable top-of-page “What is ansible-core?” overview covering its CLI tools, automation language, execution runtime, built-in content, and collection extensibility.
- Reframed the overview around the developer and automation-content-author workflow: build, test, troubleshoot, and validate content locally with `ansible-core`, then run approved team production automation through a controller rather than treating a developer workstation as the production control plane.
- Removed the repeated capability list from the introductory paragraph and added a dedicated “What ansible-core provides” label above the numbered capability cards, keeping definition, capabilities, operating guidance, and related tooling visually distinct.
- Renamed the first capability card to “Built-in command-line tools” and identified the execution, inspection, configuration, content-management, and security commands common to both distributions. The card now distinguishes the upstream PyPI distribution’s `ansible-test` entry point from the RHEL 9 AppStream RPM, which does not install that command.
- Replaced the product-heavy “Keep in mind” paragraph with a concise operating principle, then added a reusable orchestration-options comparison for Automation Controller, AWX, Semaphore UI, and Rundeck.
- Distinguished Ansible-native controllers from Semaphore UI's multi-tool self-hosted control plane and Rundeck's broader runbook-automation integration. Added evaluation criteria covering isolation, secrets, RBAC, approvals, auditing, availability, scaling, lifecycle, integrations, and support.
- Renamed the first capability to “Built-in command-line tools” and explicitly identified representative executables while preserving the packaging distinction for `ansible-test`. This separates native executables from embedded `ansible.builtin` content, separately installed collections, and related applications such as `ansible-navigator`.
- Distinguished the self-supported upstream AWX project from Red Hat-supported Automation Controller, advised learners to evaluate AWX's current release and maintenance status before production adoption, and clarified that both orchestrate automation through `ansible-core`; they do not replace its execution engine.
- Added a reusable related-tool callout for `ansible-dev-tools`. It explains that the toolkit is installed separately from `ansible-core`, identifies its development workflow, and links directly to HOD 002.
- Positioned HOD 002 as the next learning path for understanding the tools included with `ansible-dev-tools`, including `ansible-navigator`, and the upstream and Red Hat delivery paths.
- Corrected the player close behavior: closing a running or completed demonstration now resets its anonymous session, stays on the current HOD route, updates the URL to that demo module's anchor, scrolls the module below the sticky site navigation, and returns keyboard focus to its Start Demo button.
- Refocused the comparison introduction on distribution choices instead of repeating the overview, identified the RHEL AppStream RPM as this lab's path, and renamed the duplicated capabilities row to “Shared foundation.”
- Added a real VM replay and screenshot that derive the collection namespaces visible in the module documentation index. The clean installation exposes only `ansible.builtin`, producing a namespace count of one.
- Connected the comparison's additional-content row directly to the collection-inventory step while preserving the distinction between embedded `ansible.builtin` content and separately installed collections.
- Assigned the stable `HOD 001` identifier and applied the Rajat’s Applied Technology Lab creator attribution without altering terminal identity, technical evidence, or the independent-project boundary.
- Explained why this derived namespace count is not equivalent to `ansible-galaxy collection list`: `ansible.builtin` is embedded in ansible-core, while that command inventories separately installed collection artifacts in usable collection paths.

- Added an initial environment check for the RHEL release, architecture, hostname, and pre-install package state.
- Recorded the real interactive `rhc connect` workflow, replaced private credential input with neutral placeholders, and added a separate post-registration `rhc status` check.
- Added both repository views and explained the difference between subscription configuration and DNF availability.
- Added package-file verification, command discovery, configuration inspection, module documentation, and a functional localhost test.
- Replaced static-only evidence with sanitized terminal replays, text transcripts, and screenshot fallbacks.
- Clarified that an inactive `rhcd` service does not block DNF package installation.
- Standardized every replay at 120 columns by 34 rows with the `rajat` shell identity and ensured every returned prompt begins on a new line.
- Re-recorded every command through the returned shell prompt, added a completion hold, and capped idle gaps so network and installation waits do not appear frozen.
- Migrated HOD 001 to the multi-demo content model. Verification and optional cleanup belong to the demo module, while troubleshooting and recovery remain attached to the step that can produce each issue.
- Normalized every terminal replay to freeze on the final returned prompt and added validation that rejects post-prompt cursor movement in future recordings.
- Expanded the configuration-inspection explanation of `PAGER=cat`, `ansible-config dump`, and `--only-changed`.
- Expanded the final ad hoc command into its target pattern, module-selection, fully qualified collection name, and local-connection components, including why it is not an ICMP ping.

No blocking omissions were found in the RPM, manual virtual-environment, or pipx workflows, including Python selection, package provenance, runtime validation, content-boundary inspection, functional smoke testing, environment guidance, troubleshooting, and cleanup.

## Comparison review

The comparison now addresses only two deliverables: the `ansible-core` RPM from the RHEL 9 AppStream repository and an upstream `ansible-core` release installed into a selected Python environment. It makes clear that they share the same upstream project lineage while differing in package ownership, release cadence, maintenance authority, lifecycle, and support contract.

The most consequential finding is that installation entitlement and support scope are separate decisions. Red Hat documents the RHEL RPM as enabling Red Hat-provided automation content, with RHEL support limited to playbooks, roles, and modules included with or generated by Red Hat products. The page now gives this fact equal prominence with installation and lifecycle information.

Official sources reviewed:

- Ansible Core documentation and installation guidance.
- The upstream ansible-core support matrix for control-node and managed-node Python versions.
- The upstream `ansible-core` release, maintenance, branch, and tag policies.
- Red Hat's published support scope for the RHEL AppStream RPM.
- The RHEL Application Streams lifecycle, which lists ansible-core 2.14 as a RHEL 9 Full Life stream.
- Red Hat's versioned-Python and virtual-environment guidance for RHEL 9.
- The Red Hat Ansible Automation Platform lifecycle and control/managed-node coverage matrix, kept separate from the RHEL RPM path.
- Red Hat's security-backporting policy.
- The AWX project overview and Red Hat Automation Controller documentation for centralized credentials, RBAC, templates, scheduling, job history, auditing, and the relationship between the controller and the underlying Ansible engine.

## Learner experience

- Added distinct editorial covers for the RHEL AppStream RPM, pip virtual-environment, and pipx workflows. Each Start Demo screen now introduces its own installation architecture instead of repeating the HOD-level cover.
- Made per-demo editorial artwork mandatory in the content schema and validator. Future single-demo and multi-demo HODs must use a demo cover that differs from the HOD cover, sibling demo covers, and step screenshots.
- Reordered HOD 001 around the learner decision: the core concept and prerequisites now lead to the three-way installation-method comparison and then directly to the demos. Distribution detail, runtime matrices, lifecycle planning, version pinning, controller options, and related tools now follow Demo 03 as reference material.
- Expanded prerequisites to include PyPI HTTPS access, proxy and certificate preparation, and a separate clean RHEL 9 starting environment for each workflow. The page now warns learners not to run all three installation methods sequentially on one unchanged VM.
- Clarified that repository access does not itself create a Red Hat support entitlement, identified the RHEL managed-host table as technical compatibility rather than a complete support matrix, and replaced the dated upstream lifecycle column with the durable label “Maintenance milestones.”
- Updated Automation Controller references from AAP 2.6 to AAP 2.7 and linked the `ansible-dev-tools` card to the existing HOD 002 preview.
- Updated the Core Concept note to describe what these demonstrations actually do—install, inspect, and validate a local ansible-core runtime—and added the missing maintained-version and Python-selection outcome to Demo 03.
- Audited all three demo titles, pre-start objectives and outcomes, top-bar labels, step headings, introductions, command explanations, expected results, notes, and step-specific “Result looks different?” guidance against the recorded command sequences.
- Renamed Demo 01 to “Install Red Hat-provided ansible-core on RHEL 9” so the title identifies the AppStream RPM path as clearly as the pip and pipx titles identify theirs.
- Standardized every learner-facing field for the six command-identical step groups shared across the demos: system baseline, RHEL registration, connection verification, repository review, Python installation, and upstream content inspection.
- Added registration and repository recovery entries to the matching pip and pipx steps, and added the missing registration and repository outcomes to the pipx pre-start summary.
- Removed the per-step Restart Demo action. Anonymous sessions still reset when learners close or refresh the player, so the next Start Demo begins at step 1.
- Added validation that rejects command drift between a transcript and its documented single-line command sequence, as well as wording drift between command-identical steps in different demos.
- Commands have explanations, expected results, and recovery guidance.
- Credentials are entered only at the interactive prompt; neither the Red Hat account name nor its password is stored in lab content or replay media.
- Version-sensitive output is identified.
- Replays show command execution and output while screenshot fallbacks preserve access when playback is unavailable.
- The new collection step sets up later labs to demonstrate how separately installed content changes the environment without conflating a namespace count with module or plugin counts.
- The upstream workflow teaches learners to choose a maintained core/Python pair before installing, and explains why a virtual environment is safer than modifying RHEL's platform Python.
- Each demonstration now has its own outcome list, avoiding RPM registration goals appearing on the PyPI demo's start screen.
- The pipx workflow explains the difference between the user-scoped pipx installation, its managed application environment, and the launchers exposed on PATH; learners do not need to activate that environment manually.
- Replaced the two-way upstream workflow comparison with one architecture decision table covering the RHEL AppStream RPM, pip in a manually managed virtual environment, and pipx. The table now compares ownership, command availability, dependency control, version strategy, maintenance, support boundaries, and the best fit for each method.
- Added the pipx runtime boundary: pipx isolates the ansible-core Python application, while Ansible configuration, inventory, project content, collections, and operating-system dependencies can remain outside its managed environment. Additional controller-side Python libraries must be added to that environment explicitly.
- Added an operational lifecycle comparison immediately after the installation decision. It assigns ownership for each method and distinguishes state inspection, maintenance updates, feature-line migration, reproducible baselines, recovery, and removal. It also makes clear that DNF history is not a guaranteed downgrade mechanism, pipx metadata is not a complete runtime snapshot, and collections follow a lifecycle separate from ansible-core.
- Added version-pinning guidance after the lifecycle comparison and before the demonstrations. It distinguishes feature-line constraints from exact pins, explains requirements versus constraints, and records separate baselines for the RHEL RPM, virtual-environment packages, pipx-managed applications, and Ansible collections.
- Added an explicit guardrail against mixing DNF, virtual-environment, and pipx ownership of the same runtime. It protects RHEL's platform Python, identifies command-precedence checks, restates the pipx isolation boundary, and directs learners to use separate clean environments for the three alternative workflows.
- Clarified why the upstream RHEL demonstrations still register the system: the Red Hat repositories supply Python 3.12 and pip, while PyPI supplies ansible-core. The subscription requirement applies to the demonstrated RHEL dependency source, not to upstream ansible-core itself.
- Reclassified the final `ansible.builtin.ping` run as a local runtime test rather than proof of a complete control node. The page now states that remote transport, inventory, credentials, privilege escalation, network access, and managed-host dependencies remain untested.
- Extended the pinning section with artifact-source governance. The baseline now records the approved package or collection source and distinguishes version selection from repository trust, certificate policy, scanning, and lifecycle promotion.
- Changed the installation decision to begin with the automation-content requirements. Learners are now directed to check collection `requires_ansible` constraints, supported platforms, Python dependencies, and operating-system dependencies before selecting an ansible-core distribution or environment model.
- Added the repeatability warning directly to the pip and pipx installation steps. The demonstrations retain the 2.21 feature-line constraint, while the note tells learners to replace it with the exact tested maintenance release and record resolved dependencies for an accepted baseline.
- Added a continuation card after the post-demo compatibility, lifecycle, and pinning sections for a planned Linux managed-host validation HOD. It separates the completed local-runtime test from inventory, SSH host identity, managed-host Python, key-based authentication, become permissions, remote `ansible.builtin.ping`, and `ansible.builtin.setup` validation without directing learners away before they finish the HOD's architecture guidance.
- Added managed-environment registration guidance alongside the prerequisites. It distinguishes the demonstration's interactive login from activation-key and organization-ID registration at scale, identifies activation keys as protected provisioning credentials, and calls out the policy implications of Red Hat Lightspeed inventory and remote host configuration.
- Identified every recording as a directly connected reference workflow and explained how Satellite-managed RHEL content, a controlled Python package index, and an approved Galaxy or Automation Hub service replace public sources in restricted or disconnected environments.
- Standardized explanatory content on the current Red Hat Lightspeed name. Where the recorded RHEL client still prints Red Hat Insights, the expected result explains that it is the former product name rather than silently changing captured terminal output.
- Rewrote the HOD description around the learner's practical decision: choose an installation path, protect RHEL's platform Python, and verify the package, executable, runtime, and built-in content that were installed.
- Added a clear audience statement that separates beginner-friendly command execution from the practitioner-level compatibility, lifecycle, and source-governance context. The hero now expands HOD as Hands-On Demo for first-time visitors.
- Clarified the time commitment as 13–18 minutes for one selected path or 48 minutes for all three, and reduced the HOD-level outcomes to four durable promises while preserving detailed outcomes inside each demo.
- Connected each installation option directly to its matching demo. Selecting an option scrolls to and starts that independent demo while preserving the normal Start Demo gate for visitors who browse the page sequentially.
- Moved managed-registration and controlled or disconnected source guidance into one collapsed Enterprise environment considerations section, keeping the individual learner prerequisites and no-cost subscription path visible.
- Added a compact evidence section that identifies real RHEL terminal capture, package-provenance checks, expected results, troubleshooting, and source-backed architecture context without relying on unsupported promotional claims.
- Made HOD 002 the visually primary continuation action, retained the planned managed-host path as a secondary roadmap card, and converted the closing feedback strip into a concise author-credibility card with profile and feedback actions.
- Added search-focused title and description fields, a canonical URL, `TechArticle` structured data, and per-demo `HowTo` records so the page's subject, author, duration, platform, and instructional components are machine-readable.
- Expanded search and LinkedIn metadata with an explicit site name, locale, article author, large-image preview permission, declared social-image dimensions, an internal author profile linked to Rajat Agrawal’s LinkedIn identity, and a page-specific Open Graph description. Extended the JSON-LD with a canonical article identifier, educational purpose, learning outcomes, image metadata, positioned demonstrations and steps, and breadcrumb navigation. The validator now requires dimensions for every future HOD social image.
- Added optional privacy-conscious aggregate event instrumentation for HOD views, installation-path choices, demo starts and completions, official references, next-HOD actions, and author links. It sends no learner or session identifier, honors Global Privacy Control and Do Not Track, and remains inactive until an analytics endpoint or an existing Plausible integration is configured.
- Added concise minimum source controls for the RHEL RPM, pip and pipx packages, and Ansible collections. The guidance keeps repository, certificate, signature, exact-version, and hash requirements tied to the artifact path where each applies.
- Added separate update-monitoring guidance for Red Hat errata, upstream ansible-core maintenance releases and porting guides, and independently released collections.
- Added a four-point “Before you continue” check after the installation decision. It confirms collection compatibility, control-node runtime compatibility, package ownership, and the source and maintenance path without introducing a form or formal architecture decision record.
- Removed manually maintained verification and review dates from the page and lab content model. Tested operating-system, architecture, and package details remain visible, while official lifecycle dates remain part of the technical compatibility data.
- Applied the local-runtime boundary note to the localhost smoke tests in all three demonstrations and expanded the collection-compatibility guidance to identify documentation, release notes, and `meta/runtime.yml` as requirement sources.
- Reworded the pinning outcome so it reflects the explanatory guidance rather than implying that the demonstrations create a fully pinned baseline.
- Added the same optional `rhc disconnect` hygiene step to all three independently registered disposable environments, while warning learners not to disconnect a VM required by later HODs.
- Clarified that Demo 03 installs pipx from the configured Python package index, with PyPI as the source used in the recorded demonstration.
- Every replay has a plain-text transcript, remains paused until the learner starts it, and contains no credentials.
- The comparison table supports keyboard focus and horizontal scrolling on narrow screens.
- Added a post-demo operational-support section that routes RHEL, upstream ansible-core, collection, and local-environment problems to the appropriate owner instead of treating every failure as an ansible-core issue.
- Added an installation-specific diagnostic evidence checklist and a redaction reminder so learners can collect package, runtime, configuration, collection, and repository context before requesting help.
- Replaced “latest published release” with an explicit upstream matrix boundary of ansible-base 2.10 through ansible-core 2.21, while retaining the official support-matrix link for later releases.
- Expanded enterprise and per-demo cleanup guidance to distinguish local package removal and `rhc disconnect` from an organization’s complete asset-retirement process.
- Added a copyable completion-record template to every demo. It records the installation method, source and owner, resolved version, Python runtime, executable, and localhost validation without implying that the website can inspect a learner’s machine.
- Removed the demo-wide troubleshooting guide that repeated unrelated failures on every step. Each “Result looks different?” panel now covers only symptoms that can originate from the current command sequence.
- Added symptom-specific diagnostic and recovery commands beside the affected step across all three installation paths, including registration, repositories, DNF, virtual environments, pip, pipx, package provenance, content inspection, and the localhost smoke test.
- Reused identical recovery wording and commands wherever demos share the same ordered command sequence, and extended validation so future shared steps cannot silently drift.
- Expanded Demo 01 with a recorded RPM-baseline step after package and runtime verification. It saves the installed package identity and DNF metadata, explains `@System` versus `From repo`, and links the practical workflow to the lifecycle and repeatability guidance without freezing maintenance updates.
- Expanded Demo 02 with a recorded resolved-package baseline after provenance verification. The step saves `pip freeze --all` output from the active virtual environment and explains the boundary between a Python package snapshot and a portable, fully governed runtime.
- Expanded Demo 03 with a recorded pipx application baseline after isolation and provenance verification. The step inventories the managed application and injected packages, captures exact resolved Python packages, pins the accepted application against routine pipx upgrades, and explains what the pin does not govern.
- Applied the enforced Preview → Practice → Prove structure. Each Start Demo screen previews success evidence; each completion identifies the local validation boundary, maintenance path, and next actions; and the HOD closes with a concise ownership and evidence recap.
- Replaced learner-facing `/home/rajat` paths and user labels with portable home-directory notation while preserving the `rajat` identity inside the recorded terminal evidence.
- Resolved the clean-environment contradiction in all three starting-state steps. A detected ansible-core installation now tells the learner to stop and reset or use a separate clean RHEL 9 environment rather than continuing into ambiguous package ownership or PATH results.
- Clarified the cleanup boundary for every installation path. Runtime removal intentionally preserves baseline evidence, and the pip and pipx paths identify the shared Python, pipx, PATH, and collection-directory state that remains afterward.
- Added governed shared execution as the first branch in the installation decision. Learners who need shared credentials, approvals, scheduling, controlled access, or audit history are directed to treat this HOD as the runtime decision and evaluate an execution environment and controller separately.
- Added a four-question closing self-check covering package ownership, maintenance and removal, the localhost validation boundary, and the learner's reason for selecting an installation model.
- Audited every primary, recovery, diagnostic, and cleanup command against the portable-user rule. HOD 001 uses `$HOME`, `~`, shell discovery, or system paths throughout; absolute `/home/rajat` values remain only in authentic replay and transcript output.
- Expanded Demo 01 with a recorded RPM reproducibility check. It reads the saved NEVRA through `$HOME`, asks DNF to reinstall that exact AppStream build, and compares the installed RPM identity with the recorded baseline. The step explicitly limits the proof to the package baseline rather than claiming to reproduce the complete host or automation environment.
- Expanded Demo 02 with a recorded Python-baseline rebuild. It creates a separate Python 3.12 virtual environment through `$HOME`, installs the exact saved requirements, compares the complete rebuilt package inventory with the accepted baseline, verifies ansible-core, and returns the shell to the accepted environment without replacing it.
- Updated Demo 03 so the pipx inventory and pin evidence remain in `~/ansible-core-pipx-baseline.txt` while the exact, installable Python package set is saved separately in `~/ansible-core-pipx-requirements.txt`. A new recorded step deliberately unpins and removes the application, recreates it through pipx from that exact baseline, verifies the package inventory, restores the pin, and confirms the runtime.
- Added a compact compatibility summary before the demonstrations so learners know that the RPM path uses the RHEL 9 ansible-core 2.14 stream with RHEL-provided Python 3.9, while both upstream paths use ansible-core 2.21 with Python 3.12. The detailed historical matrices remain post-demo reference material.
- Reordered Demo 02 so the shell-activation lesson precedes content inspection and the `ansible.builtin.ping` smoke test remains the final functional proof.
- Extended Demo 03's recorded pipx baseline to capture the pipx version before the application inventory, exact package set, and pin result.
- Replaced obsolete activation-key registration and collection-guidance references with current official documentation pages.
- Completed a final cross-demo audit of every step title, introduction, command explanation, expected result, note, and recovery path. Command-identical shared steps remain text-identical, shared commands now use the same explanation when their purpose is unchanged, and environment-specific provenance or runtime checks retain the wording needed for their package owner.
- Kept `/home/rajat` only where pip, pipx, or ansible-core naturally resolve `$HOME` in authentic recorded output. All learner-entered commands, recovery commands, completion evidence, and cleanup paths use `$HOME` or `~`.

## Role-based review

### Technical Support Engineer

- Each command has a scoped expected result and recovery guidance, while the support section separates RHEL, upstream package, collection, and local-environment ownership. Diagnostic commands include a redaction reminder and capture the executable, runtime, configuration, collections, dependency health, and repository state. The HOD intentionally stops at local runtime validation and does not present itself as a remote-host troubleshooting guide.

### Solution Architect / Pre-Sales

- The installation decision distinguishes package provenance, environment ownership, lifecycle, support, repeatability, and content compatibility before recommending a path. Separate clean environments prevent misleading side-by-side results. The HOD does not claim production readiness; controller, managed-host, availability, security, and operating-model decisions remain outside its demonstrated boundary.

### Technical Consultant

- The workflows produce baselines that can be carried into project documentation and adapted to controlled repositories or disconnected environments. Maintenance and cleanup responsibilities are explicit for DNF, project virtual environments, and pipx. Organizational registration, governance, promotion, and asset-retirement processes are identified without turning the HOD into an implementation design document.

### Instructor

- The sequence previews the installation decision, lets learners choose one independent workflow, explains every command, checks results at each step, and ends with verification and recap. Shared commands use shared wording across demos, reducing unnecessary variation. Compatibility and lifecycle material follows the hands-on work unless it is needed for the initial choice.

### Student

- A learner can see the objective, outcomes, success evidence, duration, and step count before starting. Commands are individually copyable, expected results are visible, and troubleshooting stays beside the command that can fail. Completion identifies what succeeded, what remains untested, how the environment is maintained, and what to do next.

### Technical Marketing Manager

- The page leads with the learner's installation decision rather than a generic feature list. Claims are supported by replayed evidence, package metadata, and official references; SEO and social metadata describe the actual RHEL 9 workflows. The three paths are differentiated by ownership and support rather than presented as a contest with a universally superior option.

### Technical Account Manager

- Subscription expectations, support routing, update channels, version baselines, controlled-source adaptation, and the local-validation boundary are explicit. The completion record gives a repeatable evidence set for follow-up conversations. Remote-host acceptance, organizational policy, and production orchestration are correctly deferred to separate validation and platform decisions.

### Sales

- The HOD is transparent that RHEL repository access can come from the no-cost Developer Subscription while vendor support and production platforms have separate requirements. It presents upstream and Red Hat-provided paths accurately without unsupported savings, performance, or support claims. The most appropriate next conversation depends on the learner's ownership, governance, and support needs rather than the demonstration alone.
