import type { Metadata } from "next";
import DemoCatalog from "@/components/DemoCatalog";
import PrimaryNav from "@/components/PrimaryNav";
import SiteFooter from "@/components/SiteFooter";
import { getLabSummaries } from "@/content/labs/loader";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Hands-On Demos",
  description: `Verified, replay-led technology demonstrations from ${brand.siteName}. Watch the workflow, reproduce it, and verify the outcome.`,
};

export default function DemosPage() {
  const labs = getLabSummaries();

  return (
    <main className="hub-page" id="main-content">
      <PrimaryNav active="demos" />
      <header className="hub-hero">
        <div>
          <p className="eyebrow"><span /> HOD · Hands-On Demos</p>
          <h1>Watch it. Run it.<br /><em>Verify it.</em></h1>
        </div>
        <div className="hub-intro">
          <p>Real workflows captured on identified systems, with every command, result, explanation, completion check, and troubleshooting path needed to reproduce the outcome.</p>
          <dl><div><dt>Available now</dt><dd>{labs.filter((lab) => lab.status === "Available").length}</dd></div><div><dt>Content ID</dt><dd>HOD NNN</dd></div><div><dt>Format</dt><dd>Replay-led</dd></div></dl>
        </div>
      </header>

      <section className="hub-library" aria-labelledby="demo-library-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Demo library</p><h2 id="demo-library-title">Choose a workflow.</h2></div>
          <p>Search by technology, topic, or difficulty. Every anonymous demo session starts fresh at step 1—no login or saved progress.</p>
        </div>
        <DemoCatalog labs={labs} />
      </section>

      <section className="format-standard" aria-labelledby="demo-standard-title">
        <div><p className="eyebrow light"><span /> The HOD standard</p><h2 id="demo-standard-title">Evidence before instruction.</h2></div>
        <div className="format-standard-grid">
          <article><span>01</span><strong>Observe</strong><p>See the environment, exact execution, complete output, and returned prompt.</p></article>
          <article><span>02</span><strong>Understand</strong><p>Learn what each command does, why it matters, and how related tools differ.</p></article>
          <article><span>03</span><strong>Reproduce</strong><p>Use the prerequisites and copyable commands in an environment you control.</p></article>
          <article><span>04</span><strong>Verify</strong><p>Confirm success and use focused diagnostics when your result differs.</p></article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
