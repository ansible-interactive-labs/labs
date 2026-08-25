import Link from "next/link";
import DemoCatalog from "@/components/DemoCatalog";
import SiteBrand from "@/components/SiteBrand";
import SiteFooter from "@/components/SiteFooter";
import { getLabSummaries } from "@/content/labs/loader";
import { brand } from "@/lib/brand";

export default function Home() {
  const labs = getLabSummaries();
  const firstLab = labs.find((lab) => lab.status === "Available") ?? labs[0];
  if (!firstLab) throw new Error("At least one lab is required");

  return (
    <main id="main-content">
      <nav className="topbar">
        <SiteBrand href="#top" />
        <div className="nav-items">
          <a className="nav-link" href="#demos">Demos</a>
          <a className="nav-link subtle" href="#learning-path">Learning path</a>
          <a className="nav-link subtle" href="#lab-standard">Lab standard</a>
          <Link className="nav-link subtle" href={brand.creatorPath}>About Rajat</Link>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> {brand.descriptor}</p>
          <h1>Watch it. Run it.<br /><em>Verify it.</em></h1>
          <p className="hero-intro">Real Ansible workflows captured on real systems—with every command, result, explanation, and troubleshooting step needed to reproduce the outcome in your own environment.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/demos/${firstLab.slug}/`}>Start first demo <span>→</span></Link>
            <Link className="creator-link" href={brand.creatorPath}>Created by {brand.creator} <span>→</span></Link>
          </div>
          <p className="hero-note">No lab timer · Progress saved · Self-paced · Independent educational project</p>
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

      <section className="creator-section" id="creator" aria-labelledby="creator-title">
        <div className="creator-monogram" aria-hidden="true">RA<span>_</span></div>
        <div className="creator-copy">
          <p className="eyebrow"><span /> The creator</p>
          <h2 id="creator-title">Built and verified<br />by Rajat Agrawal.</h2>
          <p>Rajat creates practical automation learning experiences for people who want to see the complete workflow—not only the final command. Every published demo combines real execution, clear reasoning, expected results, and recovery guidance.</p>
          <div className="creator-actions">
            <Link className="button button-dark" href={brand.creatorPath}>View Rajat’s profile <span>→</span></Link>
            <a className="text-link" href={brand.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a>
          </div>
        </div>
        <aside className="creator-principles" aria-label="Rajat’s Automation Lab principles">
          <span>Creator’s standard</span>
          <ul>
            <li><strong>Real environment</strong><small>Commands are demonstrated on an identified, versioned system.</small></li>
            <li><strong>Complete evidence</strong><small>Execution, output, and the returned prompt remain visible.</small></li>
            <li><strong>Independent practice</strong><small>Learners reproduce the workflow safely in their own environment.</small></li>
          </ul>
        </aside>
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
            ["02", "Accessible", "Keyboard navigation, terminal transcripts, meaningful image descriptions, strong contrast, and reduced motion."],
            ["03", "Recoverable", "Per-step diagnostics, common-issue guidance, completion checks, and optional cleanup."],
            ["04", "Portable", "Responsive on phones and tablets, with terminal replays, screenshot fallbacks, and saved local progress."]
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

      <SiteFooter />
    </main>
  );
}
