import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import DemoPlayer from "@/components/DemoPlayer";
import LabAnalytics, { DemoStartLink } from "@/components/LabAnalytics";
import SiteFooter from "@/components/SiteFooter";
import PrimaryNav from "@/components/PrimaryNav";
import { getLab, getLabSlugs } from "@/content/labs/loader";
import type { LabComparison } from "@/content/labs/types";
import { brand } from "@/lib/brand";
import { searchIndexingEnabled } from "@/lib/search-indexing";

/* Native images keep public asset paths compatible with static deployment paths. */
/* eslint-disable @next/next/no-img-element */

export const dynamicParams = false;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function generateStaticParams() {
  return getLabSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const image = new URL((lab.socialImage ?? lab.coverImage).replace(/^\//, ""), `${siteUrl.replace(/\/$/, "")}/`).toString();
  const canonical = new URL(`demos/${lab.slug}/`, `${siteUrl.replace(/\/$/, "")}/`).toString();
  const title = lab.seoTitle ?? lab.title;
  const description = lab.seoDescription ?? lab.shortDescription;
  const imageMetadata = lab.socialImage && lab.socialImageWidth && lab.socialImageHeight
    ? { url: image, width: lab.socialImageWidth, height: lab.socialImageHeight, alt: lab.coverAlt, type: image.endsWith(".png") ? "image/png" : undefined }
    : { url: image, alt: lab.coverAlt };
  return {
    title,
    description,
    alternates: { canonical },
    robots: searchIndexingEnabled
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        }
      : {
          index: false,
          follow: false,
          noarchive: true,
          nosnippet: true,
          noimageindex: true,
          googleBot: {
            index: false,
            follow: false,
            noarchive: true,
            nosnippet: true,
            noimageindex: true
          }
        },
    openGraph: {
      title: `${lab.hodId} · ${title}`,
      description: `${description} Created by ${brand.creator}.`,
      url: canonical,
      type: "article",
      siteName: brand.siteName,
      locale: "en_CA",
      authors: [brand.linkedin],
      images: [imageMetadata]
    },
    twitter: {
      card: "summary_large_image",
      title: `${lab.hodId} · ${title}`,
      description: `${description} Created by ${brand.creator}.`,
      images: [image]
    }
  };
}

function ComparisonSection({ labSlug, comparison, index }: { labSlug: string; comparison: LabComparison; index: number }) {
  const headingId = `comparison-${labSlug}-${index + 1}`;
  const className = comparison.afterDemoId ? "comparison-section interstitial-comparison" : "comparison-section";

  return (
    <section className={className} aria-labelledby={headingId}>
      <div className="comparison-heading">
        <p className="eyebrow"><span /> {comparison.eyebrow ?? "Understand the difference"}</p>
        <h2 id={headingId}>{comparison.title}</h2>
        <p>{comparison.introduction}</p>
      </div>
      {comparison.notes?.length ? (
        <section className="comparison-notes-panel" aria-label={comparison.notesLabel ?? "Important comparison notes"}>
          <header className="comparison-notes-heading">
            <span>Key context</span>
            <h3>{comparison.notesLabel ?? "Important distinctions"}</h3>
          </header>
          <div className="comparison-notes">
            {comparison.notes.map((note, noteIndex) => (
              <aside className="comparison-note" key={note.title}>
                <span className="comparison-note-number" aria-hidden="true">{String(noteIndex + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{note.title}</strong>
                  <p>{note.detail}</p>
                  {note.reference ? <a href={note.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={note.reference.label}>{note.reference.label} ↗</a> : null}
                </div>
              </aside>
            ))}
          </div>
        </section>
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
                    {row.reference ? <a className="comparison-row-reference" href={row.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={row.reference.label}>{row.reference.label} ↗</a> : null}
                  </th>
                  {row.values.map((value, valueIndex) => (
                    <td data-label={comparison.columns[valueIndex]} key={`${row.aspect}-${valueIndex}`}>
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
      {comparison.decisionGuide ? (
        <section className="decision-guide" aria-labelledby={`${headingId}-decision-guide`}>
          <div className="decision-guide-heading">
            <span>{comparison.decisionGuide.label ?? "Decision 2"}</span>
            <h3 id={`${headingId}-decision-guide`}>{comparison.decisionGuide.title}</h3>
            <p>{comparison.decisionGuide.introduction}</p>
          </div>
          <div className="decision-option-grid">
            {comparison.decisionGuide.options.map((option) => (
              <article className="decision-option" key={option.title}>
                <span>{option.label}</span>
                <h4>{option.title}</h4>
                <p>{option.detail}</p>
                <div className="decision-option-fit"><strong>Best fit</strong><p>{option.bestFor}</p></div>
                {option.note ? <p className="decision-option-note">{option.note}</p> : null}
                {option.reference ? <a href={option.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={option.reference.label}>{option.reference.label} ↗</a> : null}
                {option.href ? <DemoStartLink className="decision-option-action" href={option.href} analyticsLabel={option.title}>{option.linkLabel ?? `Start the ${option.title} demo`} →</DemoStartLink> : null}
              </article>
            ))}
          </div>
          <div className="decision-path">
            <h4>{comparison.decisionGuide.pathTitle}</h4>
            <ol>
              {comparison.decisionGuide.path.map((item) => (
                <li key={item.condition}>
                  <span>{item.condition}</span>
                  <strong>{item.result}</strong>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}
      {comparison.followups?.map((followup, followupIndex) => (
        <section className="comparison-followup" aria-labelledby={`${headingId}-followup-${followupIndex + 1}`} key={followup.title}>
          <h3 id={`${headingId}-followup-${followupIndex + 1}`}>{followup.title}</h3>
          {followup.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {followup.items?.length ? (
            <div className="comparison-followup-grid">
              {followup.items.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      ))}
      {comparison.takeaway ? (
        <div className="comparison-takeaway">
          <strong>{comparison.takeawayLabel ?? "Which should you choose?"}</strong>
          <p>{comparison.takeaway}</p>
        </div>
      ) : null}
      <div className="comparison-sources">
        <span>Official references:</span> {comparison.sources.map((source, sourceIndex) => (
          <span key={source.href}>{sourceIndex > 0 && " · "}<a href={source.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={source.label}>{source.label} ↗</a></span>
        ))}
      </div>
    </section>
  );
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const canonical = new URL(`demos/${lab.slug}/`, `${siteUrl}/`).toString();
  const demosUrl = new URL("demos/", `${siteUrl}/`).toString();
  const authorUrl = new URL(brand.creatorPath.replace(/^\//, ""), `${siteUrl}/`).toString();
  const imageUrl = new URL((lab.socialImage ?? lab.coverImage).replace(/^\//, ""), `${siteUrl}/`).toString();
  const image = lab.socialImage && lab.socialImageWidth && lab.socialImageHeight ? {
    "@type": "ImageObject",
    url: imageUrl,
    width: lab.socialImageWidth,
    height: lab.socialImageHeight,
    caption: lab.coverAlt
  } : imageUrl;
  const article = {
    "@type": "TechArticle",
    "@id": `${canonical}#article`,
    url: canonical,
    headline: lab.seoTitle ?? lab.title,
    description: lab.seoDescription ?? lab.shortDescription,
    inLanguage: "en",
    isAccessibleForFree: true,
    author: { "@type": "Person", name: brand.creator, url: authorUrl, sameAs: [brand.linkedin] },
    publisher: { "@type": "Organization", name: brand.siteName, url: `${siteUrl}/` },
    image,
    primaryImageOfPage: image,
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    about: [...new Set([lab.title, lab.topic, lab.platform, ...lab.tags])],
    keywords: [...new Set([lab.title, lab.topic, lab.platform, ...lab.tags])].join(", "),
    proficiencyLevel: lab.difficulty,
    educationalLevel: lab.difficulty,
    learningResourceType: "Hands-on demonstration",
    teaches: lab.outcomes,
    timeRequired: `PT${lab.durationMinutes}M`,
    hasPart: lab.demos.map((demo, demoIndex) => ({
      "@type": "HowTo",
      "@id": `${canonical}#demo-${demo.id}`,
      url: `${canonical}#demo-${demo.id}`,
      position: demoIndex + 1,
      name: demo.title,
      description: demo.objective,
      totalTime: `PT${demo.durationMinutes}M`,
      step: demo.steps.map((step, stepIndex) => ({ "@type": "HowToStep", position: stepIndex + 1, name: step.title, text: step.explanation }))
    }))
  };
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      article,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: brand.siteName, item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Hands-On Demos", item: demosUrl },
          { "@type": "ListItem", position: 3, name: lab.title, item: canonical }
        ]
      }
    ]
  };

  return (
    <main className="lab-page" id="main-content">
      <PrimaryNav active="demos" className="lab-topbar" />
      <LabAnalytics hodId={lab.hodId} slug={lab.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />

      <header className="lab-hero">
        <div>
          <p className="eyebrow"><span /> {lab.hodId} · Hands-On Demo · {lab.topic} · {lab.difficulty}</p>
          <h1>{lab.title}</h1>
          <p className="lab-description">{lab.description}</p>
          {lab.audience ? <p className="lab-audience"><strong>Who this is for:</strong> {lab.audience}</p> : null}
          <p className="lab-byline">Created, demonstrated, and verified by <Link href={brand.creatorPath} data-analytics-event="author_profile_opened" data-analytics-label="Author page">{brand.creator} →</Link> · <Link href="/demos/">All Hands-On Demos →</Link></p>
        </div>
        <figure className="lab-cover-art">
          <img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} />
        </figure>
      </header>

      {lab.overview && (
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
              {item.href && <a href={item.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={item.label}>Learn about no-cost access ↗</a>}
            </article>
          ))}
        </div>
        {lab.prerequisiteCallouts?.length ? (
          <div className="prerequisite-callout-group">
            {lab.prerequisiteCallouts.map((callout) => (
              <aside className="prerequisite-callout lab-access-callout" key={callout.title}>
                <div className="callout-icon" aria-hidden="true">✓</div>
                <div>
                  <strong>{callout.title}</strong>
                  {callout.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                {callout.links?.length ? (
                  <div className="prerequisite-callout-actions">
                    {callout.links.map((link) => (
                      <a href={link.href} target="_blank" rel="noreferrer" key={link.href} data-analytics-event="official_reference_opened" data-analytics-label={link.label}>{link.label} <span>↗</span></a>
                    ))}
                  </div>
                ) : null}
              </aside>
            ))}
          </div>
        ) : null}
        {lab.prerequisiteDetails ? (
          <details className="prerequisite-details">
            <summary>
              <span>{lab.prerequisiteDetails.title}</span>
              <small>{lab.prerequisiteDetails.introduction}</small>
            </summary>
            <div>
              {lab.prerequisiteDetails.items.map((callout) => (
                <article key={callout.title}>
                  <h3>{callout.title}</h3>
                  {callout.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {callout.links?.length ? <div>{callout.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.href} data-analytics-event="official_reference_opened" data-analytics-label={link.label}>{link.label} ↗</a>)}</div> : null}
                </article>
              ))}
            </div>
          </details>
        ) : null}
      </section>

      {lab.comparisons?.map((comparison, comparisonIndex) => (
        comparison.afterDemoId ? null : <ComparisonSection labSlug={lab.slug} comparison={comparison} index={comparisonIndex} key={comparison.title} />
      ))}

      {lab.proof ? (
        <section className="lab-proof" aria-labelledby={`proof-${lab.slug}`}>
          <div>
            <p className="eyebrow"><span /> {lab.proof.eyebrow ?? "Demonstrated evidence"}</p>
            <h2 id={`proof-${lab.slug}`}>{lab.proof.title}</h2>
            <p>{lab.proof.introduction}</p>
          </div>
          <div className="lab-proof-grid">
            {lab.proof.items.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><p>{item.detail}</p></article>)}
          </div>
        </section>
      ) : null}

      {lab.demos.length ? <section className="demo-modules" aria-labelledby="demonstrations-title">
        <div className="demo-modules-heading">
          <p className="eyebrow"><span /> Watch it. Run it. Verify it.</p>
          <h2 id="demonstrations-title">{lab.demos.length === 1 ? "Demonstration" : "Demonstrations"}</h2>
          <p>{lab.demos.length > 1 ? "Choose the workflow that matches your installation decision, or complete all three to compare them. Each demonstration includes contextual explanations, expected results, recovery guidance, and a final verification." : "This demonstration includes contextual explanations, expected results, recovery guidance, and a final verification."}</p>
        </div>
        {lab.demos.map((demo) => (
          <Fragment key={demo.id}>
            <article className="demo-module" id={`demo-${demo.id}`}>
              <header className="demo-module-heading">
                <div><span>{demo.demoId}</span><h3>{demo.title}</h3></div>
                <p>{demo.objective}</p>
                <dl><div><dt>Duration</dt><dd>{demo.duration}</dd></div><div><dt>Steps</dt><dd>{demo.steps.length}</dd></div></dl>
              </header>
              <div className="player-shell" aria-label={`${demo.title} player`}>
                <DemoPlayer lab={lab} demo={demo} />
                {demo.relatedHod ? (
                  <aside className="demo-related-hod">
                    <div><strong>{demo.relatedHod.title}</strong><p>{demo.relatedHod.detail}</p></div>
                    <Link href={demo.relatedHod.href}>{demo.relatedHod.linkLabel} →</Link>
                  </aside>
                ) : null}
              </div>
            </article>
            {lab.comparisons?.map((comparison, comparisonIndex) => (
              comparison.afterDemoId === demo.id
                ? <ComparisonSection labSlug={lab.slug} comparison={comparison} index={comparisonIndex} key={comparison.title} />
                : null
            ))}
          </Fragment>
        ))}
      </section> : (
        <section className="demo-modules" aria-labelledby="demonstrations-title">
          <div className="demo-modules-heading">
            <p className="eyebrow"><span /> Demonstrations in preparation</p>
            <h2 id="demonstrations-title">The reference page is ready</h2>
            <p>The recorded installation and workflow demonstrations will be added after their commands, environments, and expected results have been tested.</p>
          </div>
        </section>
      )}

      {lab.supportGuidance ? (
        <section className="comparison-section lab-support" aria-labelledby={`support-${lab.slug}`}>
          <div className="comparison-heading">
            <p className="eyebrow"><span /> Operational support</p>
            <h2 id={`support-${lab.slug}`}>{lab.supportGuidance.title}</h2>
            <p>{lab.supportGuidance.introduction}</p>
          </div>
          <div className="support-route-grid">
            {lab.supportGuidance.routes.map((route) => (
              <article key={route.title}>
                <strong>{route.title}</strong>
                <p>{route.detail}</p>
                {route.reference ? <a href={route.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={route.reference.label}>{route.reference.label} ↗</a> : null}
              </article>
            ))}
          </div>
          <section className="support-diagnostics" aria-labelledby={`support-diagnostics-${lab.slug}`}>
            <h3 id={`support-diagnostics-${lab.slug}`}>{lab.supportGuidance.diagnostics.title}</h3>
            <p>{lab.supportGuidance.diagnostics.introduction}</p>
            <div className="support-diagnostic-grid">
              {lab.supportGuidance.diagnostics.items.map((item) => (
                <article key={item.command}>
                  <code>{item.command}</code>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      {lab.overview?.orchestrationOptions ? (
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
                  {option.href && <Link href={option.href} data-analytics-event="next_hod_selected" data-analytics-label={option.title}>{option.linkLabel ?? "Open the dedicated HOD"} →</Link>}
                  <a href={option.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={option.reference.label}>{option.reference.label} ↗</a>
                </div>
              </article>
            ))}
          </div>
          <p className="orchestration-note"><strong>Evaluate before adopting:</strong> {lab.overview.orchestrationOptions.note}</p>
        </section>
      ) : null}

      {lab.overview?.relatedTools?.length ? (
        <section className="overview-related-tools" aria-label="Related developer tools">
          {lab.overview.relatedTools.map((tool) => (
            <article className={tool.primary ? "primary-next-hod" : undefined} key={tool.title}>
              <div className="related-tool-heading">
                <p>{tool.primary ? "Continue learning" : "Related developer tool"}</p>
                <span>{tool.status}</span>
              </div>
              <h2><code>{tool.title}</code></h2>
              <p>{tool.detail}</p>
              <div className="related-tool-links">
                {tool.href && <Link href={tool.href} data-analytics-event="next_hod_selected" data-analytics-label={tool.title}>{tool.linkLabel ?? "Open the dedicated HOD"} →</Link>}
                <a href={tool.reference.href} target="_blank" rel="noreferrer" data-analytics-event="official_reference_opened" data-analytics-label={tool.reference.label}>{tool.reference.label} ↗</a>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {lab.recap ? (
        <section className="lab-recap" aria-labelledby={`recap-${lab.slug}`}>
          <div className="lab-recap-heading">
            <p className="eyebrow"><span /> Preview. Practice. Prove.</p>
            <h2 id={`recap-${lab.slug}`}>{lab.recap.title}</h2>
            <p>{lab.recap.introduction}</p>
          </div>
          <div className="lab-recap-grid">
            {lab.recap.items.map((item, index) => (
              <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><p>{item.detail}</p></article>
            ))}
          </div>
          {lab.recap.selfCheck ? (
            <div className="lab-recap-self-check">
              <div>
                <span>Self-check</span>
                <h3>{lab.recap.selfCheck.title}</h3>
                <p>{lab.recap.selfCheck.introduction}</p>
              </div>
              <ol>
                {lab.recap.selfCheck.questions.map((question) => <li key={question}>{question}</li>)}
              </ol>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="feedback-band">
        <div><strong>Created and demonstrated by {brand.creator}</strong><p>Practical automation guidance built from tested workflows, inspectable evidence, and documented platform boundaries.</p></div>
        <div className="feedback-actions"><Link href={brand.creatorPath}>Meet Rajat →</Link><a href={brand.linkedin} target="_blank" rel="noreferrer" data-analytics-event="author_profile_opened" data-analytics-label="LinkedIn">Share feedback ↗</a></div>
      </section>

      <SiteFooter />
    </main>
  );
}
