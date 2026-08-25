import type { MetadataRoute } from "next";
import { getLabSummaries } from "@/content/labs/loader";
import { primaryNavigation } from "@/lib/site-structure";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1
    },
    ...primaryNavigation.map((item) => ({
      url: `${siteUrl}${item.href}`,
      changeFrequency: "monthly",
      priority: item.key === "demos" ? 0.9 : 0.7
    } as const)),
    ...getLabSummaries().map((lab) => ({
      url: `${siteUrl}/demos/${lab.slug}/`,
      lastModified: lab.verifiedDateISO,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
