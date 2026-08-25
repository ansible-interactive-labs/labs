import type { MetadataRoute } from "next";
import { getLabSummaries } from "@/content/labs/loader";
import { brand } from "@/lib/brand";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}${brand.creatorPath}`,
      changeFrequency: "monthly",
      priority: 0.7
    },
    ...getLabSummaries().map((lab) => ({
      url: `${siteUrl}/demos/${lab.slug}/`,
      lastModified: lab.verifiedDateISO,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
