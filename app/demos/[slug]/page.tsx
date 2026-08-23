import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoPlayer from "@/components/DemoPlayer";
import { getLab, getLabSlugs } from "@/content/labs/loader";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLabSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const image = new URL(lab.coverImage.replace(/^\//, ""), `${siteUrl.replace(/\/$/, "")}/`).toString();
  return {
    title: `${lab.title} | Ansible Automation Lab`,
    description: lab.shortDescription,
    openGraph: {
      title: lab.title,
      description: lab.shortDescription,
      type: "article",
      images: [{ url: image, alt: lab.coverAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: lab.title,
      description: lab.shortDescription,
      images: [image]
    }
  };
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const genericIssueTitle = encodeURIComponent(`[Lab feedback] ${lab.title}`);
  const genericIssueUrl = `https://github.com/ansible-interactive-labs/labs/issues/new?title=${genericIssueTitle}`;

  return (
    <main className="lab-page" id="main-content">
      <nav className="topbar lab-topbar" aria-label="Lab navigation">
        <Link className="brand" href="/" aria-label="Ansible Automation Lab home">
          <span className="brand-mark">A</span>
          <span>Ansible Automation Lab</span>
        </Link>
        <div className="nav-items">
          <Link className="nav-link subtle" href="/">← Demo library</Link>
          <a className="nav-link subtle" href="#troubleshooting">Troubleshooting</a>
          <a className="nav-link subtle" href="#completion">Completion</a>
        </div>
      </nav>

      <header className="lab-hero">
        <div>
          <p className="eyebrow"><span /> {lab.topic} · {lab.difficulty}</p>
          <h1>{lab.title}</h1>
          <p>{lab.description}</p>
          <div className="lab-facts" aria-label="Lab facts">
            <span><small>Duration</small>{lab.duration}</span>
            <span><small>Platform</small>{lab.platform}</span>
            <span><small>Steps</small>{lab.steps.length}</span>
            <span><small>Last verified</small>{lab.verified.date}</span>
          </div>
        </div>
        <aside className="verification-card">
          <span>Verified environment</span>
          <dl>
            <div><dt>Operating system</dt><dd>{lab.verified.os}</dd></div>
            <div><dt>Architecture</dt><dd>{lab.verified.architecture}</dd></div>
            <div><dt>Captured package</dt><dd>{lab.verified.package}</dd></div>
          </dl>
          <p>Package versions can change as Red Hat publishes updates. Match the expected behavior, not an exact version string.</p>
        </aside>
      </header>

      <section className="lab-prerequisites" aria-labelledby="prerequisites-title">
        <div>
          <p className="eyebrow"><span /> Before you begin</p>
          <h2 id="prerequisites-title">Prerequisites</h2>
        </div>
        <div className="prerequisite-grid">
          {lab.prerequisites.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
              {item.href && <a href={item.href} target="_blank" rel="noreferrer">Learn about no-cost access ↗</a>}
            </article>
          ))}
        </div>
      </section>

      <section className="player-shell" aria-label="Interactive lab player">
        <DemoPlayer lab={lab} />
      </section>

      <section className="completion-section" id="completion" aria-labelledby="completion-title">
        <div>
          <p className="eyebrow"><span /> Verify your work</p>
          <h2 id="completion-title">Completion checklist</h2>
          <p>Confirm every outcome before moving to the next lab.</p>
        </div>
        <ul>
          {lab.completion.map((item) => <li key={item}><span>✓</span>{item}</li>)}
        </ul>
      </section>

      <section className="lab-troubleshooting" id="troubleshooting" aria-labelledby="troubleshooting-title">
        <div className="troubleshooting-intro">
          <p className="eyebrow"><span /> Troubleshooting</p>
          <h2 id="troubleshooting-title">Common issues,<br />clear next checks.</h2>
          <p>Use these checks when your result differs from the demonstration. Never work around repository problems by disabling signature verification.</p>
        </div>
        <div className="troubleshooting-list">
          {lab.troubleshooting.map((item, index) => (
            <details key={item.title} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</summary>
              <div><p>{item.detail}</p><pre><code>{item.command}</code></pre></div>
            </details>
          ))}
        </div>
      </section>

      <section className="cleanup-section" aria-labelledby="cleanup-title">
        <div>
          <p className="eyebrow"><span /> Optional</p>
          <h2 id="cleanup-title">Cleanup and reset</h2>
          <p>{lab.cleanup.explanation}</p>
        </div>
        <pre tabIndex={0}><code>{lab.cleanup.command}</code></pre>
      </section>

      <section className="feedback-band">
        <div><strong>Found something outdated?</strong><p>Tell us which result differed so the lab can stay accurate.</p></div>
        <a href={genericIssueUrl} target="_blank" rel="noreferrer">Report a lab issue ↗</a>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark">A</span><span>Ansible Automation Lab</span></div>
        <Link href="/">Return to all demos →</Link>
      </footer>
    </main>
  );
}
