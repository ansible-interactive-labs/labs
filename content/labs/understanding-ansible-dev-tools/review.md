# HOD-002 Content Review

## Readiness

The theory and comparison page is ready for local review. Recorded demonstrations remain intentionally marked as in preparation.

## Findings

- The page defines ADT as a development toolkit rather than an automation controller or a replacement for an execution environment.
- The curated list covers the ten user-facing tools named in the current upstream documentation.
- The `adt` command is explained as the package's own version-reporting entry point, not as an eleventh bundled project.
- Supporting libraries and transitive dependencies are deliberately excluded from the user-facing tool list.
- A dedicated installation-strategy comparison explains why the suite is useful when a developer needs several independently released tools. It covers shared dependency resolution, coordinated release order, version inventory, repeatability, updates, and the smaller-footprint case for installing individual tools.
- The compatibility claim is deliberately bounded: ADT reduces accidental version combinations and repeated integration work, but its upstream metadata mainly uses minimum-version requirements rather than an immutable lock. Learners are told to isolate the environment, capture resolved versions, and test their own workflows.

## Comparison review

- The comparison treats the community and Red Hat paths as distributions of the same upstream tool family.
- It distinguishes artifact type, access, installation, dependency resolution, release selection, operating environment, updates, support, and intended fit.
- It explains the documentation difference around `ansible-core`: upstream includes it in the curated list, while Red Hat workspace documentation lists it beside ADT as a preinstalled runtime.
- Claims are linked to upstream Ansible, PyPI, Red Hat documentation, the Red Hat container catalog, or the Red Hat lifecycle policy.
- The suite-versus-individual-installation guidance is sourced from the upstream package metadata, project documentation, dependency-ordered release process, and test-isolation guidance.

## Learner experience

- Each tool receives a short role-based explanation rather than a marketing description.
- The comparison is collapsed by default so the core concept remains readable before the learner opens the detailed table.
- The page clearly states that demonstrations are being prepared and does not expose a nonfunctional Start Demo control.
- A dedicated cover illustration and catalog card make HOD-002 distinct from HOD-001.
