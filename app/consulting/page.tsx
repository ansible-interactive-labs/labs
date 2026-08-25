import type { Metadata } from "next";
import Link from "next/link";
import PrimaryNav from "@/components/PrimaryNav";
import SiteFooter from "@/components/SiteFooter";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Consulting Cases",
  description: `Architecture assessments, modernization scenarios, decision frameworks, and operating-model cases from ${brand.siteName}.`,
};

export default function ConsultingPage() {
  return (
    <main className="hub-page" id="main-content">
      <PrimaryNav active="consulting" />
      <header className="hub-hero consulting-hero">
        <div><p className="eyebrow"><span /> CASE · Consulting Cases</p><h1>Assess it. Decide it.<br /><em>Transform it.</em></h1></div>
        <div className="hub-intro"><p>Structured cases will show how technical and organizational constraints become architecture decisions, implementation roadmaps, governance models, and measurable outcomes.</p><span className="availability-pill">Planned</span></div>
      </header>
      <section className="case-types" aria-labelledby="case-types-title">
        <div className="section-heading"><div><p className="eyebrow"><span /> Case library model</p><h2 id="case-types-title">From situation<br />to recommendation.</h2></div><p>Every case will state whether it is an anonymized engagement pattern or a representative scenario. No client relationship or result will be implied without evidence.</p></div>
        <div className="case-type-grid">
          <article><span>Assess</span><h3>Current-state reviews</h3><p>Capabilities, risks, constraints, maturity, dependencies, and the evidence needed to establish a useful baseline.</p></article>
          <article><span>Decide</span><h3>Architecture choices</h3><p>Options, decision criteria, trade-offs, recommendations, and the consequences of each viable path.</p></article>
          <article><span>Plan</span><h3>Transformation roadmaps</h3><p>Sequencing, prerequisites, workstreams, governance, adoption, success measures, and risk treatment.</p></article>
          <article><span>Operate</span><h3>Operating models</h3><p>Roles, ownership, controls, platform boundaries, service models, lifecycle processes, and continuous improvement.</p></article>
        </div>
      </section>
      <section className="hub-next"><div><p className="eyebrow light"><span /> Technical foundations</p><h2>Explore the technology map.</h2><p>See the product and platform domains that will connect demos, solutions, and consulting cases.</p></div><Link className="button button-primary" href="/technologies/">Browse technologies <span>→</span></Link></section>
      <SiteFooter />
    </main>
  );
}
