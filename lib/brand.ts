export const brand = {
  siteName: "Rajat’s Applied Technology Lab",
  descriptor: "Hands-On Demos, Solutions & Consulting Cases",
  tagline: "Learn it. Build it. Apply it.",
  demoTagline: "Watch it. Run it. Verify it.",
  creator: "Rajat Agrawal",
  creatorPath: "/author/rajat-agrawal/",
  linkedin: "https://www.linkedin.com/in/connectwithrajat/",
  creatorLocation: "Greater Toronto Area, Canada",
  creatorFocus: "Secure automation for hybrid infrastructure",
  disclaimer: "Rajat’s Applied Technology Lab is an independent educational project. Product names and trademarks belong to their respective owners; their use does not imply affiliation or endorsement.",
} as const;

export const formatHodNumber = (value: number) => `HOD ${String(value).padStart(3, "0")}`;
