# Installing ansible-core content review

Reviewed: August 23, 2026

## Readiness

Ready. The complete sequence was re-recorded on a reset RHEL 9 VM and reaches the stated outcome safely with prerequisites, installation, package inspection, functional verification, troubleshooting, transcripts, and cleanup.

## Findings

Implemented in this review:

- Added a source-backed comparison of the RHEL-provided and upstream community `ansible-core` delivery models.
- Explained that the community package named `ansible` is broader than the minimal `ansible-core` runtime.

- Added an initial environment check for the RHEL release, architecture, hostname, and pre-install package state.
- Added pre-registration and post-registration checks with both `rhc status` and `subscription-manager status`.
- Added both repository views and explained the difference between subscription configuration and DNF availability.
- Added package-file verification, command discovery, configuration inspection, module documentation, and a functional localhost test.
- Replaced static-only evidence with sanitized terminal replays, text transcripts, and screenshot fallbacks.
- Clarified that an inactive `rhcd` service does not block DNF package installation.

No blocking omissions were found in the install, package inspection, runtime validation, functional smoke test, troubleshooting, or cleanup sequence.

## Comparison review

The likely confusion point is RHEL-provided `ansible-core`, upstream community `ansible-core`, and the larger community package named `ansible`. A dedicated comparison is now placed before the hands-on player, where learners need that distinction.

## Learner experience

- Commands have explanations, expected results, and recovery guidance.
- Credentials are entered only at the interactive prompt and are not stored in lab content.
- Version-sensitive output is identified.
- Replays show command execution and output while screenshot fallbacks preserve access when playback is unavailable.
- Every replay has a plain-text transcript, remains paused until the learner starts it, and contains no credentials.
- The comparison table supports keyboard focus and horizontal scrolling on narrow screens.
