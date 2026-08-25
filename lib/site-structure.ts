export const primaryNavigation = [
  { key: "demos", label: "Demos", href: "/demos/" },
  { key: "solutions", label: "Solutions", href: "/solutions/" },
  { key: "consulting", label: "Consulting Cases", href: "/consulting/" },
  { key: "technologies", label: "Technologies", href: "/technologies/" },
  { key: "author", label: "About Rajat", href: "/author/rajat-agrawal/" },
] as const;

export type NavigationKey = (typeof primaryNavigation)[number]["key"];

export const contentFamilies = [
  {
    code: "HOD",
    title: "Hands-On Demos",
    href: "/demos/",
    description: "Watch a verified workflow, reproduce it in your environment, and confirm the outcome.",
    promise: "Watch it. Run it. Verify it.",
    status: "Available",
  },
  {
    code: "SOL",
    title: "Solutions",
    href: "/solutions/",
    description: "Explore end-to-end designs, implementation patterns, and production-ready reference architectures.",
    promise: "Understand it. Design it. Implement it.",
    status: "Expanding next",
  },
  {
    code: "CASE",
    title: "Consulting Cases",
    href: "/consulting/",
    description: "Work through assessments, architecture decisions, modernization scenarios, and operating models.",
    promise: "Assess it. Decide it. Transform it.",
    status: "Planned",
  },
] as const;

export const technologies = [
  { slug: "ansible", name: "Ansible", category: "Automation", status: "Available", description: "Configuration, orchestration, execution environments, and automation platform practices." },
  { slug: "terraform", name: "Terraform", category: "Infrastructure as Code", status: "Planned", description: "Reusable infrastructure, state, modules, governance, testing, and delivery workflows." },
  { slug: "kubernetes", name: "Kubernetes", category: "Cloud native", status: "Planned", description: "Workloads, platform operations, security, observability, and production architecture." },
  { slug: "github-gitlab", name: "GitHub & GitLab", category: "Developer platforms", status: "Planned", description: "Source control, CI/CD, policy, supply-chain security, and developer workflows." },
  { slug: "ai-claude", name: "AI & Claude", category: "Applied AI", status: "Planned", description: "AI-assisted engineering, agents, governance, evaluation, and practical enterprise adoption." },
  { slug: "cloud-security", name: "Cloud & Security", category: "Architecture", status: "Planned", description: "Hybrid-cloud foundations, secure-by-design patterns, controls, and operational resilience." },
] as const;
