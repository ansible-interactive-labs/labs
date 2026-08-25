import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import PrimaryNav from "@/components/PrimaryNav";
import { brand } from "@/lib/brand";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const authorUrl = `${siteUrl}${brand.creatorPath}`;
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  title: `${brand.creator} | Author`,
  description: `Meet ${brand.creator}, creator of ${brand.siteName} and a practitioner focused on secure automation for hybrid infrastructure.`,
  alternates: { canonical: authorUrl },
  openGraph: {
    title: `${brand.creator} · Creator of ${brand.siteName}`,
    description: `${brand.creatorFocus}. Practical, verified Ansible learning for independent learners.`,
    type: "profile",
    images: [{ url: socialImage, width: 1731, height: 909, alt: `${brand.creator} · ${brand.siteName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.creator} · Creator of ${brand.siteName}`,
    description: brand.creatorFocus,
    images: [socialImage],
  },
};

const profileSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: brand.creator,
  url: authorUrl,
  sameAs: [brand.linkedin],
  homeLocation: {
    "@type": "Place",
    name: brand.creatorLocation,
  },
  knowsAbout: [
    "Ansible automation",
    "Hybrid infrastructure",
    "Linux systems",
    "IT automation",
    "Technical education",
  ],
};

const focusAreas = [
  ["01", "Automation", "Designing repeatable workflows that reduce manual effort and make infrastructure operations easier to understand."],
  ["02", "Hybrid infrastructure", "Connecting Linux, Windows, cloud, and enterprise environments through practical automation patterns."],
  ["03", "Security by design", "Building automation with verification, safe defaults, traceable outcomes, and recovery guidance."],
  ["04", "Technical learning", "Turning complete, real-world execution into self-paced demonstrations learners can reproduce."],
];

export default function AuthorPage() {
  return (
    <main className="author-page" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />

      <PrimaryNav active="author" />

      <header className="author-hero">
        <div className="author-identity">
          <div className="author-monogram" aria-hidden="true">RA<span>_</span></div>
          <div className="author-status"><i /> Portfolio creator · Automation practitioner · Educator</div>
        </div>
        <div className="author-introduction">
          <p className="eyebrow"><span /> About the author</p>
          <h1>Rajat<br /><em>Agrawal.</em></h1>
          <p className="author-lede">I design, build, and improve secure automation capabilities for hybrid infrastructure—and turn that hands-on experience into learning people can reproduce.</p>
          <div className="author-facts" aria-label="Author details">
            <span><small>Based in</small>{brand.creatorLocation}</span>
            <span><small>Professional focus</small>{brand.creatorFocus}</span>
          </div>
          <div className="author-actions">
            <a className="button button-primary" href={brand.linkedin} target="_blank" rel="noreferrer">Connect on LinkedIn <span>↗</span></a>
            <Link className="text-link" href="/#demos">Explore the demos →</Link>
          </div>
        </div>
      </header>

      <section className="author-statement" aria-labelledby="author-story-title">
        <div>
          <p className="eyebrow light"><span /> Professional perspective</p>
          <h2 id="author-story-title">Automation should be<br />visible, verifiable, and useful.</h2>
        </div>
        <div className="author-story">
          <p>Rajat’s work spans secure automation and hybrid infrastructure. His professional background includes IT automation, application modernization, and communicating complex technical ideas in a way that helps teams act on them.</p>
          <p>Rajat’s Applied Technology Lab brings those disciplines together across Hands-On Demos, solution blueprints, and consulting cases. Each format connects technical context to an observable, reusable outcome.</p>
          <p className="source-note">This profile is based on Rajat’s public professional information. Current employment history, recommendations, and the complete certification record remain available on LinkedIn.</p>
        </div>
      </section>

      <section className="author-expertise" id="expertise" aria-labelledby="expertise-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Areas of focus</p><h2 id="expertise-title">Practice behind<br />the demos.</h2></div>
          <p>The lab library begins with Ansible and is grounded in a broader professional focus on secure, maintainable automation across modern infrastructure.</p>
        </div>
        <div className="expertise-grid">
          {focusAreas.map(([number, title, detail]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>
          ))}
        </div>
      </section>

      <section className="author-approach" id="approach" aria-labelledby="approach-title">
        <div className="approach-heading">
          <p className="eyebrow light"><span /> Teaching approach</p>
          <h2 id="approach-title">Show the whole workflow.</h2>
          <p>A learner should be able to understand what happened, reproduce it independently, and recover when their environment behaves differently.</p>
        </div>
        <ol>
          <li><span>01</span><div><strong>Watch a real execution</strong><p>Fixed-size terminal replays retain the command, complete output, and returned prompt.</p></div></li>
          <li><span>02</span><div><strong>Understand each decision</strong><p>Explanations cover what the command does, why it is used, and how nearby tools differ.</p></div></li>
          <li><span>03</span><div><strong>Run it independently</strong><p>Learners use their own environments, supported by prerequisites and commands they can copy.</p></div></li>
          <li><span>04</span><div><strong>Verify and troubleshoot</strong><p>Every lab ends with observable success criteria and practical diagnostics.</p></div></li>
        </ol>
      </section>

      <section className="author-credential">
        <div><span>Professional signal</span><strong>Red Hat Certified Specialist in Microsoft Windows Automation with Ansible</strong><p>One part of a wider, continuously evolving professional profile across automation, infrastructure, and security.</p></div>
        <a href={brand.linkedin} target="_blank" rel="noreferrer">View Rajat’s complete professional profile on LinkedIn <span>↗</span></a>
      </section>

      <section className="author-cta">
        <div><p className="eyebrow"><span /> Learn with Rajat</p><h2>Start with a verified<br />Hands-On Demo.</h2></div>
        <Link className="button button-primary" href="/#demos">Browse the demo library <span>→</span></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
