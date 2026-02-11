import { MetadataRoute } from "next";
import { getAbsoluteUrl } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/analyze-offer",
    "/analyze-salary",
    "/salaries",
    "/companies",
    "/guides",
    "/about",
    "/privacy",
    "/methodology",
    "/pricing",
    "/tools",
    "/tools/inflation-calculator",
    "/tools/salary-comparison",
    "/tools/percentile-calculator",
    "/tools/compensation-breakdown",
    "/tools/compare-offers",
    "/tools/equity-simulator",
    "/tools/stock-calculator",
    "/tools/negotiation-email",
  ].map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route.startsWith("/guides") ? ("weekly" as const) : ("daily" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const guides = [
    "pm-compensation-2026",
    "negotiation",
    "equity",
    "swe-compensation-2026",
    "remote-pay",
    "startup-vs-bigtech",
  ].map((slug) => ({
    url: getAbsoluteUrl(`/guides/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...routes, ...guides];
}
