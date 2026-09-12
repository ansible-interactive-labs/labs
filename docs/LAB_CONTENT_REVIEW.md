# Lab content review standard

Every lab receives a content review before it is published. Passing the JSON validator proves that the structure is complete; it does not prove that the teaching sequence is complete. The review therefore combines automated checks with an instructional audit.

## Required review report

For every new or substantially changed lab, provide the owner with a short report containing:

1. **Readiness:** Ready, ready after listed changes, or blocked.
2. **Missing or unclear content:** Steps, explanations, prerequisites, expected results, recovery guidance, verification, or cleanup that should be added.
3. **Comparison opportunities:** Terms or tools learners may confuse and how the lab will distinguish them.
4. **Accuracy and currency:** Environment tested, version-sensitive statements, and official references checked.
5. **Learner experience:** Mobile, keyboard, replay, transcript, screenshot-fallback, command-copying, progress, and accessibility observations.

If no gaps are found, say so explicitly rather than omitting the review.

## Instructional audit

Review each lab through all of these lenses:

- The title, objective, outcomes, and final verification describe the same skill.
- Each demo title identifies the installation source or operating method shown by the complete replay. The pre-start objective and outcomes account for every material phase rather than only the main installation command.
- Keep the path to the hands-on workflow short: introduce the core concept and prerequisites, present the decision learners need to choose a demo, and then show the demos. Place historical compatibility matrices, operational lifecycle guidance, version pinning, controllers, and related tools after the recorded workflows unless learners must use that material to make the initial choice.
- Every HOD uses a dedicated 16:9 editorial cover that represents its subject; recording frames and step screenshots are not used as catalog artwork.
- Every demo module uses its own 16:9 editorial cover that represents the specific workflow. It must differ from the HOD cover, every sibling demo cover, and every step image, including when the HOD contains only one demo.
- Each HOD may contain one or more demo modules. Every module has its own objective, duration, steps, verification checks, recovery guide, and optional cleanup.
- Prerequisites state the operating system, privileges, access, accounts or subscriptions, connectivity, and starting state.
- No setup action is implied or hidden between recorded steps.
- Every terminal replay has a readable transcript and a verified screenshot fallback.
- Every terminal replay uses the project-wide asciicast v2 geometry of 120 columns × 34 rows so the player remains stable between steps and across labs.
- The terminal canvas fills the fixed media pane; recordings must not appear as a smaller inset video inside the player.
- Each demo module exposes one Start Demo button; active demo mode fits the viewport, keeps navigation fixed, and confines vertical scrolling to instructional content.
- Active steps do not expose a Restart Demo action. Closing or refreshing resets the anonymous session, and the next Start Demo action begins at step 1.
- Verification appears in the player after the final functional step, and troubleshooting remains contextual to the current step or available through the in-player recovery guide instead of duplicating large page sections.
- Each learner-visible command has its own one- or two-line explanation. Separate commands render as distinct rows while multiline commands remain grouped as one command.
- Every reference to an Ansible module, plugin, role, or other collection-provided object uses its fully qualified collection name when one exists. Verify commands and all surrounding prose, headings, alternative text, expected results, and troubleshooting against the relevant collection documentation.
- Credential entry and other secrets are excluded rather than simulated in the recording.
- Terminal prompts intentionally preserve the public demonstration username `rajat`; private infrastructure, credentials, and subscription identifiers remain prohibited.
- Every shell prompt begins on a new line, with no more than one blank terminal row between completed output and the returned prompt.
- The replay freezes on the final returned prompt. No newline, carriage return, terminal reset, or other output may move the cursor onto an empty line before playback ends.
- Every step introduction describes the purpose and context without narrating its command sequence. Command rows explain what each command does, while expected results and troubleshooting cover success and recovery.
- Compare each documented command sequence with its transcript in order. The top-bar label, step heading, introduction, expected result, note, “Result looks different?” message, and general troubleshooting guide must describe what the replay actually shows.
- When the same ordered command sequence appears in more than one demo, reuse all learner-facing step content verbatim. Different replay files and fallback images are allowed when they show different environments; instructional wording is not duplicated or rewritten.
- Commands are safe to copy and do not expose credentials, local addresses, account identifiers, or destructive shortcuts.
- Version-dependent output is identified so learners do not expect an exact match unnecessarily.
- Troubleshooting covers the likely failure points and does not weaken security controls.
- The final check proves function, not merely installation.
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

Each comparison must include:

- a one-paragraph explanation of why the distinction matters;
- a side-by-side table using learner-relevant aspects;
- a plain-language recommendation describing when to choose each option;
- links to official sources;
- wording that avoids presenting one option as universally better.

Useful comparison aspects include purpose, installation source, execution model, included content, version cadence, support path, output or interface, best-fit use case, and limitations.

For the planned `ansible-navigator` lab, introduce an **ansible-playbook versus ansible-navigator** comparison before the first navigator command. Cover direct command-line execution, execution environments, interactive and stdout modes, generated artifacts, compatibility with existing playbooks, and when the simpler `ansible-playbook` workflow is sufficient.
