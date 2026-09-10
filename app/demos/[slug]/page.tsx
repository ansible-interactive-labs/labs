import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DemoPlayer from "@/components/DemoPlayer";
import SiteFooter from "@/components/SiteFooter";
import PrimaryNav from "@/components/PrimaryNav";
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
    title: lab.title,
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
  const totalSteps = lab.demos.reduce((count, demo) => count + demo.steps.length, 0);

  return (
    <main className="lab-page" id="main-content">
      <PrimaryNav active="demos" className="lab-topbar" />

      <header className="lab-hero">
        <div>
          <p className="eyebrow"><span /> {formatHodNumber(lab.hodNumber)} · {lab.topic} · {lab.difficulty}</p>
          <h1>{lab.title}</h1>
          <p className="lab-description">{lab.description}</p>
          <p className="lab-byline">Created, demonstrated, and verified by <Link href={brand.creatorPath}>{brand.creator} →</Link> · <Link href="/demos/">All Hands-On Demos →</Link></p>
          <div className="lab-facts" aria-label="Lab facts">
            <span><small>Duration</small>{lab.duration}</span>
            <span><small>Platform</small>{lab.platform}</span>
            <span><small>Demonstrations</small>{lab.demos.length}</span>
            <span><small>Total steps</small>{totalSteps}</span>
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
        <>
          <section className="lab-overview" aria-labelledby="overview-title">
            <div className="overview-heading">
              <p className="eyebrow"><span /> Core concept</p>
              <h2 id="overview-title">{lab.overview.title}</h2>
              <p>{lab.overview.introduction}</p>
            </div>
            {lab.overview.itemsLabel && <p className="overview-items-label">{lab.overview.itemsLabel}</p>}
            <div className="overview-grid">
              {lab.overview.items.map((item, index) => (
                <article key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
            {lab.overview.note && <p className="overview-note"><strong>For development and production:</strong> {lab.overview.note}</p>}
          </section>
          {lab.overview.orchestrationOptions ? (
            <section className="overview-orchestration" aria-labelledby={`orchestration-${lab.slug}`}>
              <div className="orchestration-heading">
                <p>Running Ansible as a team</p>
                <h2 id={`orchestration-${lab.slug}`}>{lab.overview.orchestrationOptions.title}</h2>
                <p>{lab.overview.orchestrationOptions.introduction}</p>
              </div>
              <div className="orchestration-grid">
                {lab.overview.orchestrationOptions.items.map((option) => (
                  <article key={option.title}>
                    <span>{option.category}</span>
                    <h3>{option.title}</h3>
                    <p>{option.detail}</p>
                    <div>
                      {option.href && <Link href={option.href}>{option.linkLabel ?? "Open the dedicated HOD"} →</Link>}
                      <a href={option.reference.href} target="_blank" rel="noreferrer">{option.reference.label} ↗</a>
                    </div>
                  </article>
                ))}
              </div>
              <p className="orchestration-note"><strong>Evaluate before adopting:</strong> {lab.overview.orchestrationOptions.note}</p>
            </section>
          ) : null}
          {lab.overview.relatedTools?.length ? (
            <section className="overview-related-tools" aria-label="Related developer tools">
              {lab.overview.relatedTools.map((tool) => (
                <article key={tool.title}>
                  <div className="related-tool-heading">
                    <p>Related developer tool</p>
                    <span>{tool.status}</span>
                  </div>
                  <h2><code>{tool.title}</code></h2>
                  <p>{tool.detail}</p>
                  <div className="related-tool-links">
                    {tool.href && <Link href={tool.href}>{tool.linkLabel ?? "Open the dedicated HOD"} →</Link>}
                    <a href={tool.reference.href} target="_blank" rel="noreferrer">{tool.reference.label} ↗</a>
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </>
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
        {lab.accessCallout ? (
          <aside className="prerequisite-callout lab-access-callout">
            <div className="callout-icon" aria-hidden="true">✓</div>
            <div>
              <strong>{lab.accessCallout.title}</strong>
              <p>{lab.accessCallout.detail}</p>
            </div>
            <a href={lab.accessCallout.href} target="_blank" rel="noreferrer">{lab.accessCallout.linkLabel} <span>↗</span></a>
          </aside>
        ) : null}
      </section>

      {lab.comparisons?.map((comparison, comparisonIndex) => {
        const headingId = `comparison-${lab.slug}-${comparisonIndex + 1}`;
        return (
          <section className="comparison-section" key={comparison.title} aria-labelledby={headingId}>
            <div className="comparison-heading">
              <p className="eyebrow"><span /> {comparison.eyebrow ?? "Understand the difference"}</p>
              <h2 id={headingId}>{comparison.title}</h2>
              <p>{comparison.introduction}</p>
            </div>
            {comparison.notes?.length ? (
              <>
                {comparison.notesLabel ? <h3 className="comparison-notes-label">{comparison.notesLabel}</h3> : null}
                <div className="comparison-notes">
                  {comparison.notes.map((note) => (
                    <aside className="comparison-note" key={note.title}>
                      <strong>{note.title}</strong>
                      <p>{note.detail}</p>
                      {note.reference ? <a href={note.reference.href} target="_blank" rel="noreferrer">{note.reference.label} ↗</a> : null}
                    </aside>
                  ))}
                </div>
              </>
            ) : null}
            <details className="comparison-deep-dive">
              <summary>{comparison.summaryLabel ?? "Read the detailed comparison"}</summary>
              <div className={`comparison-table-wrap${comparison.columns.length > 2 ? " comparison-table-wide" : ""}`} tabIndex={0} aria-label={`${comparison.title} table`}>
                <table>
                  <thead>
                    <tr><th scope="col">{comparison.rowHeader ?? "Compare"}</th>{comparison.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row) => (
                      <tr key={row.aspect}>
                        <th scope="row">
                          {row.aspect}
                          {row.reference ? <a className="comparison-row-reference" href={row.reference.href} target="_blank" rel="noreferrer">{row.reference.label} ↗</a> : null}
                        </th>
                        {row.values.map((value, index) => (
                          <td data-label={comparison.columns[index]} key={`${row.aspect}-${index}`}>
                            {comparison.cellLayout === "stacked" && value.includes("\n") ? (
                              <ul className="comparison-cell-list">
                                {value.split("\n").map((item) => <li key={item}>{item}</li>)}
                              </ul>
                            ) : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
            {comparison.takeaway ? (
              <div className="comparison-takeaway">
                <strong>{comparison.takeawayLabel ?? "Which should you choose?"}</strong>
                <p>{comparison.takeaway}</p>
              </div>
            ) : null}
            <div className="comparison-sources">
              <span>Official references:</span> {comparison.sources.map((source, index) => (
                <span key={source.href}>{index > 0 && " · "}<a href={source.href} target="_blank" rel="noreferrer">{source.label} ↗</a></span>
              ))}
            </div>
          </section>
        );
      })}

      <section className="demo-modules" aria-labelledby="demonstrations-title">
        <div className="demo-modules-heading">
          <p className="eyebrow"><span /> Watch it. Run it. Verify it.</p>
          <h2 id="demonstrations-title">{lab.demos.length === 1 ? "Demonstration" : "Demonstrations"}</h2>
          <p>Each demonstration is an independent workflow with contextual explanations, expected results, recovery guidance, and a final verification.</p>
        </div>
        {lab.demos.map((demo, index) => (
          <article className="demo-module" id={`demo-${demo.id}`} key={demo.id}>
            <header className="demo-module-heading">
              <div><span>Demo {String(index + 1).padStart(2, "0")}</span><h3>{demo.title}</h3></div>
              <p>{demo.objective}</p>
              <dl><div><dt>Duration</dt><dd>{demo.duration}</dd></div><div><dt>Steps</dt><dd>{demo.steps.length}</dd></div></dl>
            </header>
            <div className="player-shell" aria-label={`${demo.title} player`}>
              <DemoPlayer lab={lab} demo={demo} />
            </div>
          </article>
        ))}
      </section>

      <section className="feedback-band">
        <div><strong>Keep this HOD accurate.</strong><p>Tell Rajat which result differed so the demonstration can stay current.</p></div>
        <div className="feedback-actions"><a href={genericIssueUrl} target="_blank" rel="noreferrer">Report a lab issue ↗</a><a href={brand.linkedin} target="_blank" rel="noreferrer">Follow Rajat ↗</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
