# Installing ansible-core content review

Reviewed: August 22, 2026

## Readiness

Ready with recommended enhancements. The current sequence reaches the stated outcome safely and includes prerequisites, installation, package inspection, functional verification, troubleshooting, and cleanup.

## Findings

Implemented in this review:

- Added a source-backed comparison of the RHEL-provided and upstream community `ansible-core` delivery models.
- Explained that the community package named `ansible` is broader than the minimal `ansible-core` runtime.

Recommended when the VM is next captured:

- Add an initial environment-confirmation capture using `cat /etc/redhat-release` and `uname -m` so learners verify their own starting system rather than relying only on the lab metadata.
- Show `subscription-manager status` after `rhc connect` as an explicit registration verification.
- Show `subscription-manager repos --list-enabled` alongside `dnf repolist --enabled`, and explain that the first reports the subscription configuration while the second reports repositories available to DNF.

No blocking omissions were found in the install, package inspection, runtime validation, functional smoke test, troubleshooting, or cleanup sequence.

## Comparison review

The likely confusion point is RHEL-provided `ansible-core`, upstream community `ansible-core`, and the larger community package named `ansible`. A dedicated comparison is now placed before the hands-on player, where learners need that distinction.

## Learner experience

- Commands have explanations, expected results, and recovery guidance.
- Credentials are entered only at the interactive prompt and are not stored in lab content.
- Version-sensitive output is identified.
- Screenshot descriptions state the evidence shown.
- The comparison table supports keyboard focus and horizontal scrolling on narrow screens.
