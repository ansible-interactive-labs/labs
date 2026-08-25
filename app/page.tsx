import Link from "next/link";
import DemoCatalog from "@/components/DemoCatalog";
import SiteFooter from "@/components/SiteFooter";
import PrimaryNav from "@/components/PrimaryNav";
import { getLabSummaries } from "@/content/labs/loader";
import { brand } from "@/lib/brand";
import { contentFamilies } from "@/lib/site-structure";

export default function Home() {
  const labs = getLabSummaries();
  const firstLab = labs.find((lab) => lab.status === "Available") ?? labs[0];
  if (!firstLab) throw new Error("At least one lab is required");

  return (
    <main id="main-content">
      <PrimaryNav />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Rajat Agrawal’s applied technology portfolio</p>
          <h1>Learn it. Build it.<br /><em>Apply it.</em></h1>
          <p className="hero-intro">An evidence-backed professional portfolio of verified demonstrations, solution blueprints, and consulting cases across automation, infrastructure, developer platforms, cloud-native engineering, and applied AI.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/demos/${firstLab.slug}/`}>Start HOD 001 <span>→</span></Link>
            <Link className="creator-link" href={brand.creatorPath}>Created by {brand.creator} <span>→</span></Link>
          </div>
          <p className="hero-note">Published work you can inspect · Hands-On Demos available now · Solutions and consulting cases expanding next</p>
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

      <section className="content-families" aria-labelledby="content-families-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> One lab, three ways to learn</p><h2 id="content-families-title">From first command<br />to architecture decision.</h2></div>
          <p>Choose the depth that matches your goal. Every content family uses a stable identifier, clear evidence, and a consistent path from context to outcome.</p>
        </div>
        <div className="content-family-grid">
          {contentFamilies.map((family) => (
            <Link href={family.href} key={family.code}>
              <span className="family-code">{family.code}</span>
              <small>{family.status}</small>
              <h3>{family.title}</h3>
              <p>{family.description}</p>
              <strong>{family.promise} <i>→</i></strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="creator-section" id="creator" aria-labelledby="creator-title">
        <div className="creator-monogram" aria-hidden="true">RA<span>_</span></div>
        <div className="creator-copy">
          <p className="eyebrow"><span /> Portfolio creator</p>
          <h2 id="creator-title">Built and verified<br />by Rajat Agrawal.</h2>
          <p>Rajat uses this portfolio to publish inspectable evidence of how he approaches technology: complete execution, clear reasoning, architecture context, expected results, and recovery guidance—not unsupported claims.</p>
          <div className="creator-actions">
            <Link className="button button-dark" href={brand.creatorPath}>View Rajat’s profile <span>→</span></Link>
            <a className="text-link" href={brand.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a>
          </div>
        </div>
        <aside className="creator-principles" aria-label="Rajat’s Applied Technology Lab principles">
          <span>Creator’s standard</span>
          <ul>
            <li><strong>Real environment</strong><small>Commands are demonstrated on an identified, versioned system.</small></li>
            <li><strong>Complete evidence</strong><small>Execution, output, and the returned prompt remain visible.</small></li>
            <li><strong>Independent practice</strong><small>Learners reproduce the workflow safely in their own environment.</small></li>
          </ul>
        </aside>
      </section>

      <section className="portfolio-evidence" id="portfolio" aria-labelledby="portfolio-title">
        <div className="portfolio-heading">
          <p className="eyebrow light"><span /> Published portfolio evidence</p>
          <h2 id="portfolio-title">Work you can inspect,<br />reproduce, and evaluate.</h2>
          <p>The portfolio grows through complete artifacts. Each publication identifies its environment, decisions, implementation evidence, verification, and authorship.</p>
          <div className="portfolio-links"><Link className="button button-primary" href={`/demos/${firstLab.slug}/`}>Inspect HOD 001 <span>→</span></Link><Link className="text-link light-link" href={brand.creatorPath}>View Rajat’s profile →</Link></div>
        </div>
        <article className="portfolio-project">
          <div className="portfolio-project-top"><span>HOD 001</span><small>Published · Verified</small></div>
          <p className="portfolio-project-type">Ansible · RHEL 9 · Hands-On Demo</p>
          <h3>{firstLab.title}</h3>
          <p>{firstLab.description}</p>
          <dl>
            <div><dt>Evidence</dt><dd>{firstLab.stepCount} replay-led steps</dd></div>
            <div><dt>Environment</dt><dd>{firstLab.platform}</dd></div>
            <div><dt>Level</dt><dd>{firstLab.difficulty}</dd></div>
            <div><dt>Last verified</dt><dd>{firstLab.verifiedDateISO}</dd></div>
          </dl>
          <strong>Capabilities demonstrated</strong>
          <ul><li>Environment and subscription validation</li><li>Package discovery and lifecycle</li><li>Ansible CLI configuration and documentation</li><li>Functional verification and troubleshooting</li></ul>
        </article>
      </section>

      <section className="catalog" id="demos">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Featured Hands-On Demo</p><h2>Build practical skills</h2></div>
          <p>{brand.demoTagline} Every demonstration has its own shareable URL, verified environment, fresh anonymous session, and recovery guidance.</p>
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
        <div className="section-link-row"><Link className="button button-dark" href="/demos/">Browse all Hands-On Demos <span>→</span></Link></div>
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
          <div><p className="eyebrow light"><span /> Current Ansible path</p><h2>From first command<br />to enterprise automation.</h2></div>
          <p>Ansible is the first technology collection inside the broader Applied Technology Lab. Future collections use the same evidence-led content standard.</p>
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
