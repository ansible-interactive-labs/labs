# RHEL-HOD-001 Content Review

## Readiness

The administrator fundamentals reference is ready for editorial review. Its recording remains intentionally absent until the RHEL release, remote, installation scope, application, runtime, commands, expected results, and removal boundary have been tested.

## Findings

- The page defines Flatpak as a desktop application-delivery and sandboxing system rather than a generic container platform.
- The architecture follows a remote, ref, runtime dependency, local deployment, sandbox launch, portal interaction, update, and removal.
- Applications, runtimes, extensions, host components, application data, and their lifecycle owners remain separate.
- System, user, and named installations are introduced before commands are recorded.
- The workload comparison distinguishes Flatpak, RPM, and Podman-managed OCI containers.
- The operating-model table separates system, user, direct, approved third-party, centralized, and disconnected delivery decisions.
- Runtime lifecycle, storage behavior, application-data retention, portal reset, unused cleanup, remote removal, and symptom-led troubleshooting are explicit.
- A managed Thunderbird scenario connects the architecture, installation, runtime, update, and removal decisions while preserving the option to substitute another verified application before recording.
- Advanced security, repository governance, recovery, Satellite, and fleet operations have moved to RHEL-HOD-002.

## Comparison review

- The lifecycle table explains one complete installation path without turning into a command reference.
- The runtime table connects dependency location to patch and support ownership.
- The delivery comparison begins with workload and host-integration requirements rather than claiming one format is universally better.
- The decision path rejects Flatpak for drivers, kernel modules, system services, and privileged host components.

## Learner experience

- Preview: outcomes identify what an administrator should be able to explain and perform.
- Practice: the theory traces architecture, runtime ownership, and delivery decisions while the recording is prepared.
- Prove: the self-check requires the learner to explain installation identity, scope, dependencies, sandbox interaction, and format choice.
- Two planned demonstrations keep initial installation separate from continuing runtime, scope, update, and removal administration. Neither uses a dedicated next card.

## Role-based review

### Technical Support Engineer

The layer model and evidence set distinguish host packaging, remotes, applications, runtimes, installation scopes, permissions, portals, and desktop integration before escalation.

### Solution Architect / Pre-Sales

The decision path identifies suitable desktop workloads, poor fits, dependency ownership, host integration, source trust, and support boundaries without overselling portability or sandboxing.

### Technical Consultant

The page supports a basic implementation covering environment readiness, operating-model selection, remote selection, installation scope, application and runtime inspection, updates, data retention, removal, and escalation inputs.

### Instructor

The progression follows Preview → Practice → Prove and moves from vocabulary to lifecycle, runtime ownership, delivery comparison, diagnostics, and recall. The recording must explain each command before execution.

### Student

The page defines unfamiliar terms, shows where application and runtime files come from, and explains why Flatpak differs from both RPM and Podman before asking the learner to reproduce commands.

### Technical Marketing Manager

The benefits are stated without claiming that every Flatpak is safe, portable across every desktop workflow, or supported by Red Hat regardless of source.

### Technical Account Manager

The support boundaries identify what evidence belongs with RHEL, a remote, a runtime, an application, or a portal issue while keeping the installation scope visible.

### Sales

The page explains cross-distribution desktop delivery, runtime consistency, and controlled host interaction while preserving workload limitations and third-party support boundaries.

RHEL-HOD-001 satisfies the theory-stage content standard, eight-role review, Preview → Practice → Prove structure, track-specific identity rule, source-boundary requirement, and support-routing requirement.
