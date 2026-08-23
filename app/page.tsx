"use client";

/* Native images keep screenshot URLs relative, which supports GitHub Pages project paths. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type DemoStep = {
  label: string;
  title: string;
  image: string;
  alt: string;
  command?: string;
  explanation: string;
  expected: string;
  note?: string;
  troubleshooting?: string;
};

const steps: DemoStep[] = [
  {
    label: "Prepare",
    title: "Start from a current RHEL 9 system",
    image: "demos/installing-ansible-core/assets/01-clean-rhel-desktop.png",
    alt: "Clean Red Hat Enterprise Linux 9 desktop",
    command: "sudo dnf upgrade --refresh",
    explanation: "Begin with a fully updated RHEL 9 control node. Updating first reduces dependency conflicts and ensures the installation uses current package metadata and security fixes.",
    expected: "DNF reports that the system is up to date, or completes the available updates.",
    note: "The demonstration VM was fully upgraded before this workflow was recorded.",
    troubleshooting: "If DNF cannot reach Red Hat, confirm internet access, DNS resolution, and the system clock before continuing."
  },
  {
    label: "Register",
    title: "Connect the system to Red Hat",
    image: "demos/installing-ansible-core/assets/02-registration-complete.png",
    alt: "RHEL terminal confirming successful Red Hat Subscription Management registration",
    command: "sudo rhc connect",
    explanation: "The rhc client connects the host to Red Hat services. Enter your Red Hat account credentials only at the interactive prompts—never place them directly in a shell command or script.",
    expected: "subscription-manager reports Overall Status: Registered and Simple Content Access is enabled.",
    note: "A separate Ansible Automation Platform subscription is not required for this RHEL-provided package. Red Hat Insights connectivity is also not required.",
    troubleshooting: "If registration fails, verify the account has an active RHEL entitlement and check network, DNS, proxy, and system-time settings. Then run subscription-manager status before retrying."
  },
  {
    label: "Repositories",
    title: "Verify the enabled repositories",
    image: "demos/installing-ansible-core/assets/03-enabled-repositories.png",
    alt: "DNF output listing enabled RHEL BaseOS and AppStream repositories",
    command: "sudo dnf repolist --enabled",
    explanation: "BaseOS supplies the operating-system foundation. AppStream contains ansible-core and several of its dependencies. Repository names differ by architecture; this Apple Silicon VM uses aarch64 content.",
    expected: "Both the RHEL 9 BaseOS and AppStream RPM repositories appear as enabled.",
    troubleshooting: "If either repository is missing, refresh subscription data, then enable the architecture-specific BaseOS and AppStream repository IDs shown in the troubleshooting guide below."
  },
  {
    label: "Inspect",
    title: "Inspect the supported package",
    image: "demos/installing-ansible-core/assets/04-package-information.png",
    alt: "DNF repoquery output showing ansible-core package information",
    command: "sudo dnf repoquery --latest-limit 1 --info ansible-core",
    explanation: "Inspecting the package before installation confirms its version, architecture, source repository, size, license, and purpose. The exact version will change as Red Hat publishes updates.",
    expected: "The latest ansible-core build is available from the RHEL 9 AppStream repository.",
    troubleshooting: "If DNF reports no matching package, verify that AppStream is enabled, clean the DNF metadata, and rebuild the cache."
  },
  {
    label: "Install",
    title: "Install ansible-core with DNF",
    image: "demos/installing-ansible-core/assets/05-installation-complete.png",
    alt: "DNF transaction completing the ansible-core installation",
    command: "sudo dnf install ansible-core",
    explanation: "DNF resolves and installs ansible-core plus required Python, SSH, and Git dependencies. Review the transaction summary before confirming the installation in your environment.",
    expected: "The transaction finishes with Complete! and lists ansible-core among the installed packages.",
    troubleshooting: "If dependency resolution fails, refresh package metadata and review the transaction without disabling signature checks or forcing package removal."
  },
  {
    label: "Validate",
    title: "Confirm the package and runtime",
    image: "demos/installing-ansible-core/assets/06-package-and-version.png",
    alt: "Terminal output showing the ansible-core RPM and ansible version details",
    command: "rpm -q ansible-core\ndnf list --installed ansible-core\nansible --version",
    explanation: "Use the RPM and DNF views to confirm installation provenance, then inspect the Ansible runtime. The version output also identifies the active configuration file, Python runtime, module paths, and collection paths.",
    expected: "All commands return successfully and ansible --version reports the installed core release.",
    troubleshooting: "If the RPM is installed but the shell cannot find ansible, start a new terminal or run hash -r, then check /usr/bin/ansible."
  },
  {
    label: "Test",
    title: "Run a functional smoke test",
    image: "demos/installing-ansible-core/assets/07-functional-smoke-test.png",
    alt: "Ansible localhost ping module returning a successful pong response",
    command: "ansible localhost -m ansible.builtin.ping -c local",
    explanation: "A version check proves that the executable starts. This ad hoc command goes further: it executes a real Ansible module locally without requiring inventory or another managed host.",
    expected: "localhost returns SUCCESS with ping: pong and changed: false.",
    note: "You now have a working Ansible control node and can continue with inventories, playbooks, and collections.",
    troubleshooting: "An implicit-inventory warning can be normal for this localhost-only test. The important result is localhost | SUCCESS and ping: pong."
  }
];

const troubleshootingItems = [
  {
    title: "rhc connect cannot register the system",
    command: "sudo subscription-manager status",
    detail: "Confirm internet access, DNS resolution, an accurate system clock, and any required proxy configuration. Verify that the Red Hat account has an active RHEL entitlement, then retry rhc connect."
  },
  {
    title: "BaseOS or AppStream is not enabled",
    command: [
      "sudo subscription-manager refresh",
      "sudo subscription-manager repos \\",
      '  --enable="rhel-9-for-$(arch)-baseos-rpms" \\',
      '  --enable="rhel-9-for-$(arch)-appstream-rpms"'
    ].join("\n"),
    detail: "Refresh the entitlement data and enable the repository IDs that match the system architecture. Run dnf repolist --enabled again to confirm both repositories."
  },
  {
    title: "DNF reports: No match for argument ansible-core",
    command: "sudo dnf clean all\nsudo dnf makecache\nsudo dnf repoquery --latest-limit 1 ansible-core",
    detail: "This usually means AppStream is unavailable or the local metadata is stale. Rebuild the cache only after confirming the repository is enabled."
  },
  {
    title: "The localhost smoke test shows a warning",
    command: "ansible localhost -m ansible.builtin.ping -c local",
    detail: "A warning about the implicit localhost or an empty inventory is expected in this inventory-free test. Continue if the result contains SUCCESS and ping: pong."
  }
];

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const step = steps[stepIndex];

  const openDemo = () => {
    setStepIndex(0);
    setDemoOpen(true);
  };

  const copyCommand = async () => {
    if (!step.command) return;
    await navigator.clipboard.writeText(step.command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const next = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const previous = () => setStepIndex((current) => Math.max(current - 1, 0));

  useEffect(() => {
    if (!demoOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDemoOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [demoOpen]);

  return (
    <main>
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Ansible Automation Lab home">
          <span className="brand-mark">A</span>
          <span>Ansible Automation Lab</span>
        </a>
        <div className="nav-items">
          <a className="nav-link" href="#demos">Demos</a>
          <a className="nav-link subtle" href="#learning-path">Learning path</a>
          <a className="nav-link subtle" href="#troubleshooting">Troubleshooting</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Learn by watching. Build by doing.</p>
          <h1>Automation skills,<br /><em>made visible.</em></h1>
          <p className="hero-intro">
            Guided, interactive Ansible demonstrations built from real RHEL workflows—then
            reproduced safely in your own environment.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={openDemo}>Start first demo <span>→</span></button>
            <span className="hero-note">No account · No lab timer · Self-paced</span>
          </div>
        </div>

        <div className="hero-console" aria-label="Example Ansible terminal output">
          <div className="console-bar"><i /><i /><i /><span>control-node — terminal</span></div>
          <div className="console-body">
            <p><b>$</b> ansible localhost -m ping</p>
            <p className="success">localhost | SUCCESS =&gt; {'{'}</p>
            <p className="indent">&quot;changed&quot;: false,</p>
            <p className="indent">&quot;ping&quot;: &quot;pong&quot;</p>
            <p className="success">{'}'}</p>
            <span className="console-cursor" />
          </div>
        </div>
      </section>

      <section className="catalog" id="demos">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span /> Demo library</p>
            <h2>Start with the foundations</h2>
          </div>
          <p>Every demonstration includes the commands, explanations, expected results, and a practical verification step.</p>
        </div>

        <aside className="prerequisite-callout">
          <div className="callout-icon" aria-hidden="true">✓</div>
          <div>
            <strong>What subscription do I need?</strong>
            <p>
              A registered RHEL 9 system with BaseOS and AppStream access is enough to install the
              RHEL-provided <code>ansible-core</code> package. Individual learners can obtain a
              no-cost <a href="https://developers.redhat.com/articles/faqs-no-cost-red-hat-enterprise-linux" target="_blank" rel="noreferrer">Red Hat Developer Subscription for Individuals</a>, subject to the program terms.
              An Ansible Automation Platform subscription is not required for this demo.
            </p>
          </div>
          <a href="https://developers.redhat.com/register" target="_blank" rel="noreferrer">Join Red Hat Developer <span>↗</span></a>
        </aside>

        <article className="demo-card">
          <button className="demo-visual" type="button" onClick={openDemo} aria-label="Open Installing ansible-core interactive demo">
            <img src="demos/installing-ansible-core/assets/06-package-and-version.png" alt="RHEL terminal showing the installed ansible-core package and Ansible version" />
            <span className="play-button" aria-hidden="true">▶</span>
            <span className="duration">8 min</span>
          </button>
          <div className="demo-content">
            <div className="tags"><span>Getting started</span><span>RHEL 9</span><span>7 steps</span></div>
            <h3>Installing ansible-core</h3>
            <p>Register RHEL, inspect subscribed repositories, install the supported package, and prove that Ansible can execute a module.</p>
            <ul className="outcomes">
              <li>Connect RHEL to Red Hat services</li>
              <li>Understand BaseOS and AppStream</li>
              <li>Validate a working control node</li>
            </ul>
            <button className="button button-dark" type="button" onClick={openDemo}>Open interactive demo <span>→</span></button>
          </div>
        </article>

        <section className="troubleshooting-section" id="troubleshooting">
          <div className="troubleshooting-intro">
            <p className="eyebrow"><span /> Troubleshooting</p>
            <h2>Common issues,<br />clear next checks.</h2>
            <p>Use these checks when your result differs from the demonstration. They avoid unsafe shortcuts such as disabling package-signature verification.</p>
          </div>
          <div className="troubleshooting-list">
            {troubleshootingItems.map((item, index) => (
              <details key={item.title} open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</summary>
                <div>
                  <p>{item.detail}</p>
                  <pre><code>{item.command}</code></pre>
                </div>
              </details>
            ))}
          </div>
        </section>
      </section>

      <section className="path-section" id="learning-path">
        <div className="section-heading path-heading">
          <div>
            <p className="eyebrow light"><span /> Ansible learning path</p>
            <h2>From first command<br />to enterprise automation.</h2>
          </div>
          <p>One visual workflow at a time. Future demonstrations will use this same reusable player and hands-on format.</p>
        </div>
        <div className="path-grid">
          {[
            ["01", "Foundation", "Installation, configuration, inventory, ad hoc commands"],
            ["02", "Playbooks", "YAML, modules, variables, loops, handlers, templates"],
            ["03", "Reusable content", "Roles, collections, execution environments, testing"],
            ["04", "Automation platform", "Controller, Hub, workflows, EDA, governance"]
          ].map(([number, title, detail], index) => (
            <article className={index === 0 ? "path-card active" : "path-card"} key={number}>
              <span>{number}</span><h3>{title}</h3><p>{detail}</p><small>{index === 0 ? "In progress" : "Coming next"}</small>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark">A</span><span>Ansible Automation Lab</span></div>
        <p>Watch the workflow. Practice in your environment. Verify the outcome.</p>
      </footer>

      {demoOpen && (
        <div className="demo-overlay" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <div className="demo-player" ref={playerRef}>
            <header className="player-header">
              <div>
                <span className="player-kicker">Interactive demo</span>
                <strong>Installing ansible-core</strong>
              </div>
              <div className="player-tools">
                <button type="button" onClick={() => playerRef.current?.requestFullscreen()} aria-label="Open demo in fullscreen">↗ <span>Fullscreen</span></button>
                <button type="button" onClick={() => setDemoOpen(false)} aria-label="Close demo">×</button>
              </div>
            </header>

            <div className="player-progress" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
              {steps.map((item, index) => (
                <button className={index === stepIndex ? "current" : index < stepIndex ? "complete" : ""} type="button" key={item.label} onClick={() => setStepIndex(index)} aria-label={`Go to step ${index + 1}: ${item.label}`}>
                  <span>{index < stepIndex ? "✓" : index + 1}</span><small>{item.label}</small>
                </button>
              ))}
            </div>

            <div className="player-stage">
              <div className="stage-media">
                <img key={step.image} src={step.image} alt={step.alt} />
                <span className="stage-number">{String(stepIndex + 1).padStart(2, "0")}</span>
                <a className="image-link" href={step.image} target="_blank" rel="noreferrer">Open full-size screenshot ↗</a>
              </div>
              <aside className="stage-guide">
                <p className="step-label">Step {stepIndex + 1} of {steps.length} · {step.label}</p>
                <h2 id="demo-title">{step.title}</h2>
                <p className="explanation">{step.explanation}</p>
                {step.command && (
                  <div className="command-block">
                    <div><span>Run in your environment</span><button type="button" onClick={copyCommand} aria-live="polite">{copied ? "Copied!" : "Copy"}</button></div>
                    <pre><code>{step.command}</code></pre>
                  </div>
                )}
                <div className="expected"><strong>Expected result</strong><p>{step.expected}</p></div>
                {step.note && <p className="step-note">ⓘ {step.note}</p>}
                {step.troubleshooting && (
                  <details className="step-troubleshooting">
                    <summary>Result looks different?</summary>
                    <p>{step.troubleshooting}</p>
                  </details>
                )}
              </aside>
            </div>

            <footer className="player-footer">
              <button className="player-back" type="button" onClick={previous} disabled={stepIndex === 0}>← Back</button>
              <span>Use ← → arrow keys to navigate</span>
              {stepIndex < steps.length - 1 ? (
                <button className="player-next" type="button" onClick={next}>Next step →</button>
              ) : (
                <button className="player-next" type="button" onClick={() => setStepIndex(0)}>Replay demo ↻</button>
              )}
            </footer>
          </div>
        </div>
      )}
    </main>
  );
}
