import type { Metadata } from "next";
import Link from "next/link";
import PrimaryNav from "@/components/PrimaryNav";
import SiteFooter from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Solutions",
  description: `End-to-end reference architectures and implementation patterns from ${brand.siteName}.`,
};

const solutionLayers = [
  ["01", "Problem and constraints", "Define the outcome, operating context, assumptions, non-functional requirements, and boundaries."],
  ["02", "Architecture and decisions", "Show the components, integrations, alternatives, trade-offs, and reasons behind the selected design."],
  ["03", "Implementation", "Provide the workflow, configuration, code structure, controls, and deployment approach needed to build it."],
  ["04", "Operations and evidence", "Include validation, security, observability, failure modes, lifecycle guidance, and measurable outcomes."],
];

export default function SolutionsPage() {
  return (
    <main className="hub-page" id="main-content">
      <PrimaryNav active="solutions" />
      <header className="hub-hero hub-hero-dark">
        <div><p className="eyebrow light"><span /> SOL · Solutions</p><h1>Understand it.<br />Design it. <em>Implement it.</em></h1></div>
        <div className="hub-intro"><p>Solutions move beyond individual commands into complete, reusable technical designs. Each one will connect a real problem to architecture, implementation, verification, and operational guidance.</p><span className="availability-pill">Expanding next</span></div>
      </header>
      <section className="solution-model" aria-labelledby="solution-model-title">
        <div className="section-heading"><div><p className="eyebrow"><span /> Publication model</p><h2 id="solution-model-title">What every solution will contain.</h2></div><p>A consistent structure makes future solutions comparable, reviewable, and useful beyond a single product demonstration.</p></div>
        <div className="solution-layer-grid">{solutionLayers.map(([number, title, detail]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{detail}</p></article>)}</div>
      </section>
      <section className="hub-next"><div><p className="eyebrow light"><span /> Build the foundation first</p><h2>Start with the verified demos.</h2><p>Hands-On Demos establish the individual tools and workflows that future solutions will combine.</p></div><Link className="button button-primary" href="/demos/">Explore Hands-On Demos <span>→</span></Link></section>
      <SiteFooter />
    </main>
  );
}
