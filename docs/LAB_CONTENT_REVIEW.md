# Lab content review standard

Every lab receives a content review before it is published. The JSON validator enforces the minimum teaching structure and technical contract; the instructional audit confirms that the required content is accurate, coherent, and useful rather than merely present.

## Required teaching structure

Every available HOD follows **Preview → Practice → Prove**:

1. **Preview the outcome:** State the learner, problem, prerequisites, objective, demonstrable outcomes, and visible success criteria before the demo starts.
2. **Practice the workflow:** Give every step an action-and-object label, purpose, explained commands, expected result, contextual troubleshooting, and evidence aligned with the replay.
3. **Prove the result:** End every demo with verification checks, an explicit validation boundary, a copyable completion record, a maintenance path, and actionable next steps. End the HOD with a concise recap that connects its durable lessons without repeating the walkthrough.

An available HOD cannot pass `pnpm validate:labs` without this structure. The validator requires HOD outcomes, prerequisites, an HOD recap, demo outcomes, verification, a validation boundary, maintenance ownership, next actions, and complete instructional fields for every step.

## Required review report

For every new or substantially changed lab, provide the owner with a short report containing:

1. **Readiness:** Ready, ready after listed changes, or blocked.
2. **Missing or unclear content:** Steps, explanations, prerequisites, expected results, recovery guidance, verification, or cleanup that should be added.
3. **Comparison opportunities:** Terms or tools learners may confuse and how the lab will distinguish them.
4. **Accuracy and currency:** Environment tested, version-sensitive statements, and official references checked.
5. **Learner experience:** Mobile, keyboard, replay, transcript, screenshot-fallback, command-copying, progress, and accessibility observations.

If no gaps are found, say so explicitly rather than omitting the review.

## Mandatory role-based review

Every HOD review report must assess the content from all eight perspectives below. Each role section records what the role needs, what the HOD already provides, any remaining limitation, and whether that limitation blocks publication.

- **Technical Support Engineer:** Failure isolation, diagnostic evidence, redaction, recovery safety, escalation ownership, and support boundaries.
- **Solution Architect / Pre-Sales:** Architectural fit, decision criteria, prerequisites, integration boundaries, lifecycle, scale, security, and what the demonstration does not prove.
- **Technical Consultant:** Implementation readiness, repeatability, controlled-source adaptation, operational handoff, maintenance ownership, and cleanup consequences.
- **Instructor:** Learning sequence, prerequisites, terminology, cognitive load, explanation quality, demonstrations, checks for understanding, and recap.
- **Student:** Clarity, pacing, command readability, expected results, recovery help, accessible interaction, confidence, and the next learning action.
- **Technical Marketing Manager:** Audience, problem statement, differentiated value, evidence, accurate claims, discoverability, social presentation, and calls to action.
- **Technical Account Manager:** Customer lifecycle, entitlement and support expectations, adoption risks, upgrade planning, governance, and the evidence needed for ongoing conversations.
- **Sales:** Qualification context, business relevance, subscription or trial requirements, honest limitations, suitable next conversation, and avoidance of unsupported product promises.

`pnpm validate:labs` rejects a review report that omits any role or leaves a role section without a substantive finding.

## Technical marketing audit

Before publishing, review how the HOD communicates its value as well as how it teaches the task:

- Name the intended learner and make the difficulty label consistent with both the command work and the surrounding decision guidance.
- Lead with the problem the learner will solve, not a list of package features or recorded steps.
- Keep the HOD-level outcome list to a small set of durable promises; retain implementation detail in each demo's outcomes.
- When demos are alternative paths, say that learners may choose one and distinguish the single-path duration from the time required to complete every path.
- Connect each decision option directly to its matching demo rather than asking learners to locate it manually.
- Keep individual prerequisites visible and place organization-specific registration, governance, and disconnected-environment guidance in progressive disclosure.
- State the evidence behind the HOD, such as the tested environment, replayed output, provenance checks, expected results, and official references, without unsupported expertise or adoption claims.
- Expand Hands-On Demo on the first visible HOD reference for visitors who do not yet know the abbreviation.
- Give the completed HOD one visually primary continuation action. Planned learning paths and reference material remain secondary.
- Use a search-focused metadata title and description, canonical URL, meaningful social preview, and appropriate structured data without forcing the visible page title to carry every keyword.
- For a page promoted on LinkedIn, declare the Open Graph site, article title, description, canonical URL, author, locale, image URL, alternative text, and actual image dimensions. Keep the important artwork and text away from the image edges, then refresh and inspect the published URL with LinkedIn Post Inspector before launching the campaign.
- Identify the HOD as a free educational resource in structured data, connect the author to the internal profile and public professional profile, expose learning outcomes and ordered HowTo steps, and include breadcrumb data. Permit large image previews for search crawlers.
- After publishing a new HOD, confirm its canonical URL in the generated sitemap, submit or refresh the sitemap in Google Search Console, inspect the page with URL Inspection, and check the same canonical URL in LinkedIn Post Inspector. These launch checks use the deployed page; they cannot be completed against localhost.
- If aggregate measurement is enabled, collect only the events required to improve the learning journey, avoid learner or persistent session identifiers, honor browser privacy signals, and document the external provider's retention and consent responsibilities.

## Instructional audit

Review each lab through all of these lenses:

- The title, objective, outcomes, and final verification describe the same skill.
- For an ansible-core installation decision, identify required collections, their `requires_ansible` constraints, supported platforms, and external dependencies before recommending a version or installation path.
- Each demo title identifies the installation source or operating method shown by the complete replay. The pre-start objective and outcomes account for every material phase rather than only the main installation command.
- Keep the path to the hands-on workflow short: introduce the core concept and prerequisites, present the decision learners need to choose a demo, and then show the demos. Place historical compatibility matrices, operational lifecycle guidance, version pinning, controllers, and related tools after the recorded workflows unless learners must use that material to make the initial choice.
- Every HOD uses a dedicated 16:9 editorial cover that represents its subject; recording frames and step screenshots are not used as catalog artwork.
- Every demo module uses its own 16:9 editorial cover that represents the specific workflow. It must differ from the HOD cover, every sibling demo cover, and every step image, including when the HOD contains only one demo.
- Each HOD may contain one or more demo modules. Every module has its own objective, duration, steps, verification checks, step-specific recovery guidance, and optional cleanup.
- Preview each demo's existing verification criteria on its Start Demo screen so learners know what successful evidence will look like before they begin.
- Give every recorded demo a copyable completion record that identifies the installation method, artifact source and owner, resolved version, runtime, executable, and functional result. Use placeholders when the learner must supply output from their own environment.
- Record the maintenance path that owns future updates, state what the final check does and does not prove, and give the learner two to six concrete next actions.
- End every available HOD with a short recap containing at least three durable takeaways. Do not repeat command sequences or long comparison tables in the recap.
- When ownership can span vendors or projects, provide concise support routing and list the diagnostic evidence a learner should collect and redact before requesting help.
- Describe a version matrix with an explicit first and last covered release. Avoid calling a static table “latest” unless its currency is maintained automatically.
- Prerequisites state the operating system, privileges, access, accounts or subscriptions, connectivity, and starting state.
- When a package-source or entitlement explanation needs more space, place it in a reusable `prerequisiteCallouts` entry instead of overloading a prerequisite card. State which dependency the subscription supplies and which source supplies the demonstrated application.
- No setup action is implied or hidden between recorded steps.
- Every terminal replay has a readable transcript and a verified screenshot fallback.
- Every terminal replay uses the project-wide asciicast v2 geometry of 120 columns × 34 rows so the player remains stable between steps and across labs.
- The terminal canvas fills the fixed media pane; recordings must not appear as a smaller inset video inside the player.
- Each demo module exposes one Start Demo button; active demo mode fits the viewport, keeps navigation fixed, and confines vertical scrolling to instructional content.
- Active steps do not expose a Restart Demo action. Closing or refreshing resets the anonymous session, and the next Start Demo action begins at step 1.
- Verification appears in the player after the final functional step, and troubleshooting remains contextual to the current step instead of duplicating a demo-wide recovery guide on every step.
- Each learner-visible command has its own one- or two-line explanation. Separate commands render as distinct rows while multiline commands remain grouped as one command.
- Every reference to an Ansible module, plugin, role, or other collection-provided object uses its fully qualified collection name when one exists. Verify commands and all surrounding prose, headings, alternative text, expected results, and troubleshooting against the relevant collection documentation.
- Credential entry and other secrets are excluded rather than simulated in the recording.
- Every published terminal session is recorded while signed in as the public demonstration user `rajat`, and terminal prompts preserve `[rajat@HOSTNAME]` as creator branding. Learner-visible commands use `$HOME` or `~` instead of hardcoded `/home/rajat` paths. Resolved command output may show `/home/rajat` as authentic evidence, while surrounding guidance remains portable or clearly labels it as the recorded example. Private infrastructure, credentials, and subscription identifiers remain prohibited.
- Every shell prompt begins on a new line, with no more than one blank terminal row between completed output and the returned prompt.
- The replay freezes on the final returned prompt. No newline, carriage return, terminal reset, or other output may move the cursor onto an empty line before playback ends.
- Every step introduction describes the purpose and context without narrating its command sequence. Command rows explain what each command does, while expected results and troubleshooting cover success and recovery.
- Compare each documented command sequence with its transcript in order. The top-bar label, step heading, introduction, expected result, note, and “Result looks different?” message must describe what the replay actually shows.
- When the same ordered command sequence appears in more than one demo, reuse all learner-facing step content verbatim. Different replay files and fallback images are allowed when they show different environments; instructional wording is not duplicated or rewritten.
- Keep every “Result looks different?” summary and recovery item limited to symptoms that can be produced by commands in the current step. Put a diagnostic or corrective command in the step that generated the symptom; do not repeat a demo-wide troubleshooting guide throughout the player.
- When an identical ordered command sequence is reused anywhere on the platform, treat it as one canonical instructional step. Across demos in the same HOD and across different HODs, keep the label, heading, alternative text, introduction, command explanations, expected result, note, troubleshooting summary, and recovery guidance identical. Improve every occurrence together when the canonical wording needs correction; do not create an HOD-specific variation of a shared step.
- Commands are safe to copy and do not expose credentials, local addresses, account identifiers, or destructive shortcuts.
- Version-dependent output is identified so learners do not expect an exact match unnecessarily.
- When a demonstration uses a feature-line constraint, place an exact-version warning beside that installation step instead of relying only on later lifecycle guidance.
- Troubleshooting covers the likely failure points and does not weaken security controls.
- The final check proves function, not merely installation.
- State the boundary of the final check. A localhost test must not be described as proof that remote inventory, transport, credentials, privilege escalation, network policy, or managed-host dependencies are ready.
- Keep each HOD independently useful and do not add a linear next-step card. State untested acceptance boundaries directly. Link another published HOD only when it is a materially relevant alternative or deeper reference, and never present it as a required sequence.
- When multiple installation paths can coexist on a machine, explain package ownership, command precedence, platform-Python protection, and whether learners should use separate clean environments.
- Version-pinning guidance records the approved artifact source as well as the selected release; a pin alone does not establish repository trust or organizational approval.
- Keep source controls proportional and practical: identify the approved repository or server, preserve certificate and signature validation, and state when exact versions or hashes are expected.
- Name the official update channels for each distribution path. Treat RHEL RPM advisories, upstream ansible-core releases, and collection releases as separate monitoring streams.
- Cleanup explains consequences and is clearly optional when later labs depend on the environment.
- Screenshot alternative text describes the evidence learners need to identify.
- New terminology is explained before it is required.

## When a comparison is required

Add a comparison when two names, packages, commands, interfaces, distributions, or support models are likely to look interchangeable to a learner. Typical triggers include:

- upstream community software versus a vendor-provided build;
- a minimal runtime versus a larger distribution;
- two commands that can run the same automation through different workflows;
- local execution versus an execution environment;
- supported lifecycle content versus faster-moving upstream releases.

Place the comparison immediately before the learner first needs the distinction. Use the structured `comparisons` field in `lab.json`; do not hide the explanation in a note or troubleshooting accordion.

When one choice depends on another, present the comparison as a staged decision instead of repeating the same factors in separate sections. Use the optional `decisionGuide` block for concise option cards and a quick decision path after the primary comparison table.

Use the optional `followups` block for guidance that follows from the decision but does not belong in another comparison row, such as avoiding mixed package ownership or explaining what a shared validation command does and does not prove.

When learners need a final decision check, use a short confirmation block rather than a form or architecture record. It should confirm content compatibility, runtime compatibility, installation ownership, and the package source or maintenance path without collecting or retaining learner data.

Each comparison must include:

- a one-paragraph explanation of why the distinction matters;
- a side-by-side table using learner-relevant aspects;
- a plain-language recommendation describing when to choose each option;
- links to official sources;
- wording that avoids presenting one option as universally better.

Useful comparison aspects include purpose, installation source, execution model, included content, version cadence, support path, output or interface, best-fit use case, and limitations.

For the planned `ansible-navigator` lab, introduce an **ansible-playbook versus ansible-navigator** comparison before the first navigator command. Cover direct command-line execution, execution environments, interactive and stdout modes, generated artifacts, compatibility with existing playbooks, and when the simpler `ansible-playbook` workflow is sufficient.
