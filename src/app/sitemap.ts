import { MetadataRoute } from "next";
import { CURATED_COMPARISONS } from "@/app/compare/data/curated-comparisons";

const baseUrl = "https://avgpay.com";

const staticRoutes = [
  "",
  "/about",
  "/companies",
  "/compare",
  "/contribute",
  "/analyze-offer",
  "/analyze-salary",
  "/guides",
  "/methodology",
  "/pricing",
  "/privacy",
  "/salaries",
  "/submit",
  "/tools",
  "/tools/compare-offers",
  "/tools/compensation-breakdown",
  "/tools/equity-simulator",
  "/tools/inflation-calculator",
  "/tools/negotiation-email",
  "/tools/percentile-calculator",
  "/tools/salary-comparison",
  "/tools/stock-calculator",
];

const guideSlugs = [
  "pm-compensation-2026",
  "negotiation",
  "equity",
  "swe-compensation-2026",
  "remote-pay",
  "startup-vs-bigtech",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const guides = guideSlugs.map((slug) => ({
    url: `${baseUrl}/guides/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const comparisons = CURATED_COMPARISONS.map((comparison) => ({
    url: `${baseUrl}/compare/${comparison.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...routes, ...guides, ...comparisons];
}
