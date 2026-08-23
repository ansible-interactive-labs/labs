import Link from "next/link";
import DemoCatalog from "@/components/DemoCatalog";
import { labs } from "@/content/labs";

export default function Home() {
  const firstLab = labs.find((lab) => lab.status === "Available") ?? labs[0];

  return (
    <main id="main-content">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Ansible Automation Lab home">
          <span className="brand-mark">A</span>
          <span>Ansible Automation Lab</span>
        </a>
        <div className="nav-items">
          <a className="nav-link" href="#demos">Demos</a>
          <a className="nav-link subtle" href="#learning-path">Learning path</a>
          <a className="nav-link subtle" href="#lab-standard">Lab standard</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Learn by watching. Build by doing.</p>
          <h1>Automation skills,<br /><em>made visible.</em></h1>
          <p className="hero-intro">Guided, interactive Ansible demonstrations built from real RHEL workflows—then reproduced safely in your own environment.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/demos/${firstLab.slug}/`}>Start first demo <span>→</span></Link>
            <span className="hero-note">No lab timer · Progress saved · Self-paced</span>
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
          <div><p className="eyebrow"><span /> Demo library</p><h2>Build practical skills</h2></div>
          <p>Search the growing library by topic or difficulty. Every demonstration has its own shareable URL, verified environment, progress tracking, and recovery guidance.</p>
        </div>

        <aside className="prerequisite-callout">
          <div className="callout-icon" aria-hidden="true">✓</div>
          <div>
            <strong>No-cost RHEL access for individual learners</strong>
            <p>A registered RHEL system with the required repositories is enough for the first demo. A separate Ansible Automation Platform subscription is not required to install the RHEL-provided <code>ansible-core</code> package.</p>
          </div>
          <a href="https://developers.redhat.com/register" target="_blank" rel="noreferrer">Join Red Hat Developer <span>↗</span></a>
        </aside>

        <DemoCatalog labs={labs} />
      </section>

      <section className="lab-standard" id="lab-standard">
        <div className="section-heading path-heading">
          <div><p className="eyebrow light"><span /> Built for independent practice</p><h2>A consistent standard<br />for every lab.</h2></div>
          <p>Each workflow is captured on a real system and packaged so learners can reproduce it safely in their own environment.</p>
        </div>
        <div className="standard-grid">
          {[
            ["01", "Verified", "Tested OS, architecture, package details, and a visible last-verified date."],
            ["02", "Accessible", "Keyboard navigation, meaningful screenshot descriptions, strong contrast, and reduced motion."],
            ["03", "Recoverable", "Per-step diagnostics, common-issue guidance, completion checks, and optional cleanup."],
            ["04", "Portable", "Responsive on phones and tablets, with full-size screenshots and saved local progress."]
          ].map(([number, title, detail]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="path-section" id="learning-path">
        <div className="section-heading path-heading">
          <div><p className="eyebrow light"><span /> Ansible learning path</p><h2>From first command<br />to enterprise automation.</h2></div>
          <p>One visual workflow at a time. New demonstrations use the same repeatable player, prerequisites, verification, and troubleshooting format.</p>
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
    </main>
  );
}
