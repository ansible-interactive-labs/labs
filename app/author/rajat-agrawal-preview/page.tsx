import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import PrimaryNav from "@/components/PrimaryNav";
import { brand } from "@/lib/brand";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const authorUrl = `${siteUrl}${brand.creatorPath}`;
const socialImage = `${siteUrl}/og.png`;
const certificationsUrl = `${brand.linkedin}details/certifications/`;

export const metadata: Metadata = {
  title: `${brand.creator} | Author (Preview)`,
  description: `Preview: meet ${brand.creator}, Ansible SME and Infrastructure & Cloud Automation Engineer, creator of ${brand.siteName}.`,
  robots: { index: false, follow: false },
  openGraph: {
    title: `${brand.creator} · Creator of ${brand.siteName} (Preview)`,
    description: `${brand.creatorFocus}. Practical, verified Ansible learning for independent learners.`,
    type: "profile",
    images: [{ url: socialImage, width: 1731, height: 909, alt: `${brand.creator} · ${brand.siteName}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.creator} · Creator of ${brand.siteName} (Preview)`,
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
  jobTitle: "Automation Engineer",
  description: "Ansible SME | Infrastructure & Cloud Automation Engineer | Speaker | Author",
  homeLocation: {
    "@type": "Place",
    name: brand.creatorLocation,
  },
  worksFor: {
    "@type": "Organization",
    name: "Signifi Solutions Inc.",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Algoma University" },
    { "@type": "CollegeOrUniversity", name: "Jaipur National University" },
  ],
  knowsAbout: [
    "Ansible automation",
    "Ansible Automation Platform",
    "Terraform",
    "Site reliability engineering",
    "Platform engineering",
    "DevSecOps",
    "Kubernetes and OpenShift",
    "Hybrid infrastructure",
    "Technical education",
  ],
};

const focusAreas = [
  ["01", "Ansible automation", "Playbooks, roles, collections, and Ansible Automation Platform across RHEL, Windows, network, and hybrid-cloud estates."],
  ["02", "Platform engineering & SRE", "Kubernetes and OpenShift, execution environments, CI/CD integration, and reliability practices for production infrastructure."],
  ["03", "DevSecOps", "Secure-by-design automation, Zero Trust architecture, and cloud security governance—backed by CCSK and CCZT."],
  ["04", "Technical enablement", "A decade developing and delivering official Red Hat curriculum, from classroom courses to a Red Hat Summit session."],
];

const careerTimeline = [
  {
    when: "Aug 2025 – Present",
    current: true,
    role: "Automation Engineer",
    org: "Signifi Solutions Inc. · Hybrid · Mississauga, Ontario",
    detail: "Automates infrastructure and applications with Ansible and Terraform, secures Linux, Windows, and Active Directory systems, monitors cloud and on-prem network devices, and designs Kubernetes clusters and containerized workloads.",
  },
  {
    when: "Jan 2023 – Present",
    current: true,
    role: "Lead Technical Consultant",
    org: "Self-employed · Remote",
    detail: "Independent Ansible, Terraform, and Bash automation consulting. Red Hat Certified Instructor delivering seven official Red Hat curricula (RH124/RH134, AU294, AU374, AU467, DO417, DO457, RH436), a Red Hat Summit speaker, and co-author of Red Hat Enterprise Linux Automation with Ansible (AU294).",
  },
  {
    when: "2015 – 2023 · 7 yrs 6 mos",
    current: false,
    role: "Technical Consultant, Customer Success — Associate to Senior",
    org: "Red Hat · Pune, India · Hybrid",
    detail: "Wrote Ansible playbooks, roles, and collections for RHEL, OpenStack, and OpenShift; designed and deployed Ansible Automation Platform solutions; developed DO417 and TL112 course content; and led train-the-trainer and certification-proctoring programs across APAC.",
  },
  {
    when: "2012 – 2015",
    current: false,
    role: "Early career — Linux administration & security training",
    org: "Skyhigh Networks · GRRAS Training and Development Center · TechnoAce Info Solutions · Infinity IT Academy",
    detail: "Started in Linux server administration and information-security training—delivering RHCSA/RHCE-track, CEH, and ECSA instruction—before moving into enterprise technical support.",
  },
];

const certifications = [
  { title: "Red Hat Certified Specialist in Microsoft Windows Automation with Ansible", issuer: "Red Hat", date: "Issued Nov 2025 · Expires Nov 2028" },
  { title: "Red Hat Certified Specialist in Ansible Network Automation", issuer: "Red Hat", date: "Issued Oct 2025 · Expires Oct 2028" },
  { title: "Certificate of Cloud Security Knowledge v5 (CCSK)", issuer: "Cloud Security Alliance", date: "Issued Jul 2024" },
  { title: "Certificate of Competence in Zero Trust (CCZT)", issuer: "Cloud Security Alliance", date: "Issued Jan 2024" },
  { title: "KCNA: Kubernetes and Cloud Native Associate", issuer: "The Linux Foundation", date: "Issued Mar 2024 · Expires Mar 2027" },
  { title: "PCA: Prometheus Certified Associate", issuer: "The Linux Foundation", date: "Issued Mar 2024 · Expires Mar 2027" },
  { title: "GitHub Foundations", issuer: "GitHub", date: "Issued Mar 2024 · Expires Mar 2027" },
  { title: "CCSK Contributor", issuer: "Cloud Security Alliance", date: "Issued Jul 2024" },
  { title: "Zero Trust Training (ZTT) Contributor", issuer: "Cloud Security Alliance", date: "Issued Nov 2023" },
  { title: "Managing Jira Projects: 3 Helpful Concepts and Features", issuer: "LinkedIn Learning", date: "Issued Feb 2023" },
];

const education = [
  { school: "Algoma University", program: "Degree Certificate in Project Management", years: "2023 – 2024" },
  { school: "Jaipur National University", program: "Master of Computer Applications (MCA)", years: "2018 – 2020" },
  { school: "Jaipur National University", program: "Bachelor of Computer Applications (BCA)", years: "2015 – 2017" },
];

export default function AuthorPreviewPage() {
  return (
    <main className="author-page" id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />

      <PrimaryNav active="author" />

      <div className="preview-banner" role="note">
        <strong>Preview only</strong> — this route is temporary and excluded from search indexing. Compare against{" "}
        <Link href={brand.creatorPath}>the live profile page</Link>.
      </div>

      <header className="author-hero">
        <div className="author-identity">
          <div className="author-monogram" aria-hidden="true">RA<span>_</span></div>
          <div className="author-status"><i /> Ansible SME · Infrastructure & Cloud Automation Engineer · Speaker · Author</div>
        </div>
        <div className="author-introduction">
          <p className="eyebrow"><span /> About the author</p>
          <h1>Rajat<br /><em>Agrawal.</em></h1>
          <p className="author-lede">I design, build, and improve secure automation capabilities for hybrid infrastructure—spanning Linux, Windows, cloud, network, and container platforms—and turn a decade of enterprise automation and Red Hat enablement work into learning people can reproduce.</p>
          <div className="author-facts" aria-label="Author details">
            <span><small>Based in</small>{brand.creatorLocation}</span>
            <span><small>Current role</small>Automation Engineer, Signifi Solutions Inc.</span>
            <span><small>Also building</small>Independent Ansible &amp; Terraform consulting · Red Hat Certified Instructor</span>
            <span><small>LinkedIn community</small>18,984 followers · 500+ connections</span>
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
          <p>Rajat&rsquo;s professional focus is Ansible-based orchestration, reusable automation content, platform engineering, CI/CD integration, and secure automation practice for enterprise environments—applied across Linux, Windows, cloud, network, and container platforms.</p>
          <p>That focus was built over seven and a half years at Red Hat, where Rajat progressed from Associate to Senior Technical Consultant in Customer Success: writing Ansible playbooks, roles, and collections for RHEL, OpenStack, and OpenShift, developing and co-authoring official Red Hat curriculum, and speaking at Red Hat Summit. He now applies it as an Automation Engineer at Signifi Solutions Inc. and, in parallel, as an independent Lead Technical Consultant and Red Hat Certified Instructor.</p>
          <p>Rajat&rsquo;s Applied Technology Lab brings that same discipline to a public audience: Hands-On Demos, solution blueprints, and consulting cases that connect technical context to an observable, reusable outcome.</p>
          <p className="source-note">This profile summarizes Rajat&rsquo;s public LinkedIn history as of September 2026. His complete role history, endorsements, and recommendations remain available on LinkedIn.</p>
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

      <section className="author-timeline" id="career" aria-labelledby="career-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> A decade in technical enablement</p><h2 id="career-title">From classroom<br />to control plane.</h2></div>
          <p>Two current roles run in parallel: a full-time automation engineering position and an independent Red Hat training and consulting practice, both built on seven and a half years inside Red Hat itself.</p>
        </div>
        <ol className="timeline-list">
          {careerTimeline.map((item) => (
            <li className="timeline-item" key={item.role}>
              <div className="timeline-when">{item.when}{item.current && <strong>Current</strong>}</div>
              <div className="timeline-role">
                <h3>{item.role}</h3>
                <p className="timeline-org">{item.org}</p>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ol>
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

      <section className="author-certifications" id="certifications" aria-labelledby="certifications-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Certifications &amp; education</p><h2 id="certifications-title">Credentials behind<br />the practice.</h2></div>
          <p>Ten active certifications spanning Red Hat, cloud security, and cloud-native infrastructure, on top of a Master of Computer Applications and a project-management credential.</p>
        </div>
        <div className="certification-grid">
          {certifications.map((cert) => (
            <article key={cert.title}>
              <span>{cert.issuer}</span>
              <strong>{cert.title}</strong>
              <p>{cert.date}</p>
            </article>
          ))}
        </div>
        <div className="author-education" aria-label="Education">
          {education.map((item) => (
            <div key={`${item.school}-${item.program}`}>
              <span>{item.years}</span>
              <strong>{item.program}</strong>
              <small>{item.school}</small>
            </div>
          ))}
        </div>
        <a className="text-link" href={certificationsUrl} target="_blank" rel="noreferrer">View all credentials on LinkedIn ↗</a>
      </section>

      <section className="author-cta">
        <div><p className="eyebrow"><span /> Learn with Rajat</p><h2>Start with a verified<br />Hands-On Demo.</h2></div>
        <Link className="button button-primary" href="/#demos">Browse the demo library <span>→</span></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
