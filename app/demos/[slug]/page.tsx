import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoPlayer from "@/components/DemoPlayer";
import SiteBrand from "@/components/SiteBrand";
import SiteFooter from "@/components/SiteFooter";
import { getLab, getLabSlugs } from "@/content/labs/loader";
import { brand, formatHodNumber } from "@/lib/brand";

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
    title: `${lab.title} | ${brand.siteName}`,
    description: lab.shortDescription,
    openGraph: {
      title: `${formatHodNumber(lab.hodNumber)} · ${lab.title}`,
      description: `${lab.shortDescription} Created by ${brand.creator}.`,
      type: "article",
      images: [{ url: image, alt: lab.coverAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${formatHodNumber(lab.hodNumber)} · ${lab.title}`,
      description: `${lab.shortDescription} Created by ${brand.creator}.`,
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
        <SiteBrand />
        <div className="nav-items">
          <Link className="nav-link subtle" href="/">← Demo library</Link>
          <a className="nav-link subtle" href="#troubleshooting">Troubleshooting</a>
          <a className="nav-link subtle" href="#completion">Completion</a>
        </div>
      </nav>

      <header className="lab-hero">
        <div>
          <p className="eyebrow"><span /> {formatHodNumber(lab.hodNumber)} · {lab.topic} · {lab.difficulty}</p>
          <h1>{lab.title}</h1>
          <p className="lab-description">{lab.description}</p>
          <p className="lab-byline">Created, demonstrated, and verified by <Link href={brand.creatorPath}>{brand.creator} →</Link></p>
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

      {lab.overview && (
        <section className="lab-overview" aria-labelledby="overview-title">
          <div className="overview-heading">
            <p className="eyebrow"><span /> Core concept</p>
            <h2 id="overview-title">{lab.overview.title}</h2>
            <p>{lab.overview.introduction}</p>
          </div>
          <div className="overview-grid">
            {lab.overview.items.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
          {lab.overview.note && <p className="overview-note"><strong>Keep in mind:</strong> {lab.overview.note}</p>}
        </section>
      )}

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

      {lab.comparisons?.map((comparison, comparisonIndex) => {
        const headingId = `comparison-${lab.slug}-${comparisonIndex + 1}`;
        return (
          <section className="comparison-section" key={comparison.title} aria-labelledby={headingId}>
            <div className="comparison-heading">
              <p className="eyebrow"><span /> Understand the difference</p>
              <h2 id={headingId}>{comparison.title}</h2>
              <p>{comparison.introduction}</p>
            </div>
            <div className="comparison-table-wrap" tabIndex={0} aria-label={`${comparison.title} comparison table`}>
              <table>
                <thead>
                  <tr><th scope="col">Compare</th>{comparison.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row) => (
                    <tr key={row.aspect}>
                      <th scope="row">{row.aspect}</th>
                      {row.values.map((value, index) => <td key={`${row.aspect}-${index}`}>{value}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="comparison-takeaway">
              <strong>Which should you choose?</strong>
              <p>{comparison.takeaway}</p>
              <span>Official references: {comparison.sources.map((source, index) => (
                <span key={source.href}>{index > 0 && " · "}<a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></span>
              ))}</span>
            </div>
          </section>
        );
      })}

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
        <div><strong>Keep this HOD accurate.</strong><p>Tell Rajat which result differed so the demonstration can stay current.</p></div>
        <div className="feedback-actions"><a href={genericIssueUrl} target="_blank" rel="noreferrer">Report a lab issue ↗</a><a href={brand.linkedin} target="_blank" rel="noreferrer">Follow Rajat ↗</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
