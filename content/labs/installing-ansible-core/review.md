# Installing ansible-core content review

Reviewed: September 11, 2026

## Readiness

Ready. Two complete installation paths were recorded on reset RHEL 9 environments: the Red Hat-provided AppStream RPM and upstream ansible-core from PyPI in an isolated Python 3.12 virtual environment. Both reach their stated outcomes with compatibility guidance, provenance checks, content-boundary inspection, functional verification, troubleshooting, transcripts, screenshots, and cleanup.

## Findings

Implemented in this review:

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
- Added Demo 02 for upstream ansible-core from PyPI. The RHEL subscription supplies only the supported Python 3.12 prerequisite; ansible-core itself is installed from PyPI into `/home/rajat/.venvs/ansible-core-2.21`.
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

- Replaced the introductory comparison with a source-backed deep dive limited to the RHEL 9 AppStream and upstream `ansible-core` distributions.
- Explained their shared core capabilities and their different artifact formats, installation ownership, runtime integration, version strategies, maintenance windows, security practices, lifecycles, and compatibility tradeoffs.
- Corrected the support description: a RHEL entitlement grants repository access, but RHEL support for this RPM is limited to automation supplied or generated by Red Hat products. Broader support for the core platform and core-maintained modules requires Ansible Automation Platform.
- Documented why the RHEL RPM version can remain on 2.14 while fixes are backported, and why Red Hat advisories—not only the upstream version number—must be used for security assessment.
- Removed all discussion of the separately distributed community `ansible` package because it is outside this lab's comparison scope.
- Added a reusable top-of-page “What is ansible-core?” overview covering its CLI tools, automation language, execution runtime, built-in content, and collection extensibility.
- Reframed the overview around the developer and automation-content-author workflow: build, test, troubleshoot, and validate content locally with `ansible-core`, then run approved team production automation through a controller rather than treating a developer workstation as the production control plane.
- Removed the repeated capability list from the introductory paragraph and added a dedicated “What ansible-core provides” label above the numbered capability cards, keeping definition, capabilities, operating guidance, and related tooling visually distinct.
- Renamed the first capability card to “Built-in command-line tools” and made it explicit that installing `ansible-core` provides native execution, inspection, configuration, content-management, security, and developer-testing commands, including `ansible-test`.
- Replaced the product-heavy “Keep in mind” paragraph with a concise operating principle, then added a reusable orchestration-options comparison for Automation Controller, AWX, Semaphore UI, and Rundeck.
- Distinguished Ansible-native controllers from Semaphore UI's multi-tool self-hosted control plane and Rundeck's broader runbook-automation integration. Added evaluation criteria covering isolation, secrets, RBAC, approvals, auditing, availability, scaling, lifecycle, integrations, and support.
- Renamed the first capability to “Built-in command-line tools” and explicitly identified representative executables installed with `ansible-core`, including the content-development and validation command `ansible-test`. This distinguishes native executables from embedded `ansible.builtin` content, separately installed collections, and related applications such as `ansible-navigator`.
- Distinguished the self-supported upstream AWX project from Red Hat-supported Automation Controller, advised learners to evaluate AWX's current release and maintenance status before production adoption, and clarified that both orchestrate automation through `ansible-core`; they do not replace its execution engine.
- Added a reusable related-tool callout for `ansible-navigator`, using Red Hat's current “automation content navigator” terminology while retaining the package and command name. It explains that the tool is installed separately, is not part of `ansible-core`, and commonly runs content through execution environments that contain `ansible-core`.
- Gave the future `ansible-navigator` HOD an explicit coming-soon state instead of a dead link. The content model accepts an internal HOD URL and custom link label when that demonstration is published.
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
- Migrated HOD 001 to the multi-demo content model. Verification, cross-step troubleshooting, and optional cleanup now belong to the demo module and appear contextually inside the player rather than as duplicated page sections.
- Normalized every terminal replay to freeze on the final returned prompt and added validation that rejects post-prompt cursor movement in future recordings.
- Expanded the configuration-inspection explanation of `PAGER=cat`, `ansible-config dump`, and `--only-changed`.
- Expanded the final ad hoc command into its target pattern, module-selection, fully qualified collection name, and local-connection components, including why it is not an ICMP ping.

No blocking omissions were found in either install path, Python selection, package provenance, runtime validation, content-boundary inspection, functional smoke test, activation guidance, troubleshooting, or cleanup sequence.

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

- Commands have explanations, expected results, and recovery guidance.
- Credentials are entered only at the interactive prompt; neither the Red Hat account name nor its password is stored in lab content or replay media.
- Version-sensitive output is identified.
- Replays show command execution and output while screenshot fallbacks preserve access when playback is unavailable.
- The new collection step sets up later labs to demonstrate how separately installed content changes the environment without conflating a namespace count with module or plugin counts.
- The upstream workflow teaches learners to choose a maintained core/Python pair before installing, and explains why a virtual environment is safer than modifying RHEL's platform Python.
- Each demonstration now has its own outcome list, avoiding RPM registration goals appearing on the PyPI demo's start screen.
- Every replay has a plain-text transcript, remains paused until the learner starts it, and contains no credentials.
- The comparison table supports keyboard focus and horizontal scrolling on narrow screens.
