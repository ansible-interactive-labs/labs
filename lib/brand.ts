export const brand = {
  siteName: "Rajat’s Automation Lab",
  descriptor: "Verified Ansible Hands-On Demos",
  tagline: "Watch it. Run it. Verify it.",
  creator: "Rajat Agrawal",
  linkedin: "https://www.linkedin.com/in/connectwithrajat/",
  disclaimer: "Rajat’s Automation Lab is an independent educational project and is not affiliated with or endorsed by Red Hat. Ansible and Red Hat are trademarks of Red Hat, Inc. or its subsidiaries.",
} as const;

export const formatHodNumber = (value: number) => `HOD ${String(value).padStart(3, "0")}`;
