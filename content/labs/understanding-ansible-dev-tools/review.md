# ANSIBLE-HOD-002 Content Review

## Readiness

The theory, comparison, support guidance, lifecycle guidance, and recorded Red Hat RPM demonstration are ready for validation. The demonstration installs the Red Hat `ansible-dev-tools` package on RHEL 9, inventories the delivered toolchain, verifies a working rootless Podman engine, creates a playbook project, and records an explicit successful `ansible-lint` result.

## Findings

- The page defines ADT as a coordinated development toolkit rather than an automation controller, an execution environment, or a permanent dependency lock.
- The curated list covers the ten user-facing tools named by current upstream documentation. Supporting libraries remain outside that learner-facing list.
- The development journey connects those tools to create, lint, test, build, run and inspect, and sign stages. The page states that this HOD proves only create and lint plus local Podman engine initialization.
- The distribution comparison uses **upstream** for the Python package and reserves **community container** for the specifically named image.
- The current upstream package requirement is described from package metadata. Learners are directed to check the metadata for the release they intend to install rather than assuming a Python requirement indefinitely.
- The audience statement identifies the developer, platform-engineering, administrator, and learner profiles for whom the HOD is intended.
- An execution environment is defined as a container image containing ansible-core, collections, Python dependencies, and system dependencies. The page makes clear that installing ADT neither creates nor validates one.
- The upstream pointer links to ANSIBLE-HOD-001 only for its Python-isolation concepts. It does not present ANSIBLE-HOD-001 as an exact ADT procedure, and it warns that pipx does not expose dependency applications by default.
- Registration and verification use `rhc connect` and `rhc status`. No learner workflow shows `subscription-manager register` or `subscription-manager status`.
- HODs remain standalone demonstrations. ANSIBLE-HOD-002 does not contain a linear next-HOD card; its related-HOD link is an optional reference for learners who want background on upstream Python isolation.

## Learner experience

- ANSIBLE-HOD-002-D01 contains eleven descriptive action-and-object steps.
- The first step checks RHEL, architecture, hostname, `ansible-dev-tools`, `podman`, and `container-tools`, preventing a pre-existing container package from silently changing the recorded workflow.
- Every command has a concise explanation, expected result, troubleshooting guidance, and symptom-focused recovery guidance.
- Package queries prove RPM ownership; installed DNF metadata records the ansible-dev-tools and Podman versions, architectures, source RPMs, and originating repositories; `adt --version` inventories the active executables; `podman info` proves local rootless engine initialization; `ansible-creator` and `ansible-lint` prove basic integrated work.
- The final lint command keeps diagnostics visible, stores Ansible cache state under `$HOME`, and prints a confirmation only after a successful lint exit status.
- Registry authentication, image pulls and builds, Molecule, signing, controller integration, and remote automation remain explicitly outside the demonstrated boundary.
- The replay uses the `rajat` terminal identity while learner-visible paths remain portable through `$HOME` or `~`.

## Comparison review

- The operational lifecycle comparison assigns ownership for upstream Python environments, the community container, and Red Hat RPM installations.
- Update, inspection, repeatability, recovery, and removal responsibilities are described without presenting tags, package metadata, or DNF history as complete rollback guarantees.
- Support routing distinguishes RHEL and AAP content access, Podman and container-platform failures, individual upstream-tool defects, and custom automation content.
- The diagnostic bundle uses `rhc status`, enabled-repository checks, RPM provenance, tool inventory, Podman engine evidence, and verbose lint evidence. It reminds learners to remove credentials and private infrastructure details before sharing output.
- Cleanup states that package removal is not a complete rollback: dependencies, caches, images, configuration, and generated projects can remain. It also shows how to disable the architecture-specific AAP repository when the registered host should no longer consume that content.

## Role-based review

### Technical Support Engineer

- Each step now includes a symptom-specific recovery path. The page identifies the failing layer, provides a safe diagnostic bundle, and routes the issue to the owner of registration, repositories, RPMs, containers, upstream tools, or custom content.

### Solution Architect / Pre-Sales

- The HOD separates installation, executable discovery, local engine validation, project validation, and the larger execution-environment acceptance boundary. The distribution and lifecycle comparisons expose artifact, ownership, update, support, and repeatability trade-offs.

### Technical Consultant

- Prerequisites and the first recorded step establish a clean package state. The completion record preserves package provenance, the resolved tool inventory, engine status, and functional results. The maintenance path keeps the Red Hat environment under DNF ownership.

### Instructor

- The page follows Preview → Practice → Prove: it previews outcomes and the tool journey, demonstrates the workflow step by step, then closes with verification criteria, a completion record, a validation boundary, next actions, and durable takeaways.

### Student

- Commands, explanations, expected results, notes, and recovery guidance are paired consistently. The final steps provide visible success rather than asking a learner to interpret silence, and the next validation areas are named without overloading this introductory demo.

### Technical Marketing Manager

- The title and demo promise match the recorded RHEL workflow. The value proposition is evidence-based: a coordinated toolkit, visible package provenance, an inventoried runtime, a working rootless engine, and a generated project that passes linting.

### Technical Account Manager

- Subscription and architecture requirements, package source, maintenance owner, support boundary, diagnostic evidence, and post-update validation are visible. Local success is not presented as registry, controller, or production readiness.

### Sales

- The upstream and Red Hat paths remain legitimate choices. The page explains the fit for self-managed upstream environments and for organizations that require Red Hat-tested artifacts, controlled repositories, lifecycle guidance, and vendor support without implying that ADT alone delivers a production automation platform.

## Approval conclusion

ANSIBLE-HOD-002 satisfies the eight-role review, Preview → Practice → Prove structure, focused troubleshooting standard, portable-path rule, package-provenance requirement, and explicit validation-boundary requirement. Final publication still depends on repository validation, lint, build, replay safety checks, and route-level browser checks.
