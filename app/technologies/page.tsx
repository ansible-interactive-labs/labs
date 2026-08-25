import type { Metadata } from "next";
import Link from "next/link";
import PrimaryNav from "@/components/PrimaryNav";
import SiteFooter from "@/components/SiteFooter";
import { brand } from "@/lib/brand";
import { technologies } from "@/lib/site-structure";

export const metadata: Metadata = {
  title: "Technologies",
  description: `Browse the automation, infrastructure, developer-platform, cloud-native, security, and applied-AI coverage planned for ${brand.siteName}.`,
};

export default function TechnologiesPage() {
  return (
    <main className="hub-page" id="main-content">
      <PrimaryNav active="technologies" />
      <header className="hub-hero technology-hero">
        <div><p className="eyebrow"><span /> Technology directory</p><h1>One practice.<br /><em>Connected disciplines.</em></h1></div>
        <div className="hub-intro"><p>Technologies are collections—not isolated navigation tabs. Each collection will bring together its Hands-On Demos, Solutions, and Consulting Cases as coverage grows.</p><dl><div><dt>Available</dt><dd>1</dd></div><div><dt>Roadmap</dt><dd>{technologies.length - 1}</dd></div><div><dt>Content views</dt><dd>3</dd></div></dl></div>
      </header>
      <section className="technology-directory" aria-labelledby="technology-directory-title">
        <div className="section-heading"><div><p className="eyebrow"><span /> Coverage map</p><h2 id="technology-directory-title">Browse by technology.</h2></div><p>The directory can grow without overcrowding the primary navigation. Availability reflects published site content, not the limits of Rajat’s professional experience.</p></div>
        <div className="technology-grid">
          {technologies.map((technology, index) => (
            <article className={technology.status === "Available" ? "available" : ""} key={technology.slug}>
              <div><span>{String(index + 1).padStart(2, "0")}</span><small>{technology.status}</small></div>
              <p className="technology-category">{technology.category}</p>
              <h3>{technology.name}</h3>
              <p>{technology.description}</p>
              {technology.status === "Available" ? <Link href="/demos/">View Ansible content →</Link> : <span className="planned-label">Coverage planned</span>}
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
