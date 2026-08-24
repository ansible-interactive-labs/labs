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
- Prerequisites state the operating system, privileges, access, accounts or subscriptions, connectivity, and starting state.
- No setup action is implied or hidden between recorded steps.
- Every terminal replay has a readable transcript and a verified screenshot fallback.
- Every terminal replay uses the project-wide asciicast v2 geometry of 120 columns × 34 rows so the player remains stable between steps and across labs.
- The terminal canvas fills the fixed media pane; recordings must not appear as a smaller inset video inside the player.
- The pre-launch state exposes one Start lab button; active lab mode fits the viewport, keeps navigation fixed, and confines vertical scrolling to instructional content.
- Separate commands render as visually distinct blocks while multiline commands remain grouped together.
- Credential entry and other secrets are excluded rather than simulated in the recording.
- Terminal prompts intentionally preserve the public demonstration username `rajat`; private infrastructure, credentials, and subscription identifiers remain prohibited.
- Every shell prompt begins on a new line; command output and the next prompt must never be joined in a replay or transcript.
- Every step explains what the command does, why it is needed, what success looks like, and what to check when the result differs.
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

Each comparison must include:

- a one-paragraph explanation of why the distinction matters;
- a side-by-side table using learner-relevant aspects;
- a plain-language recommendation describing when to choose each option;
- links to official sources;
- wording that avoids presenting one option as universally better.

Useful comparison aspects include purpose, installation source, execution model, included content, version cadence, support path, output or interface, best-fit use case, and limitations.

For the planned `ansible-navigator` lab, introduce an **ansible-playbook versus ansible-navigator** comparison before the first navigator command. Cover direct command-line execution, execution environments, interactive and stdout modes, generated artifacts, compatibility with existing playbooks, and when the simpler `ansible-playbook` workflow is sufficient.
