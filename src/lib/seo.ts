const DEFAULT_SITE_URL = "https://avgpay.com";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");

export const NON_INDEXABLE_PREFIXES = [
  "/admin",
  "/dashboard",
  "/login",
  "/signup",
  "/auth",
  "/api",
];

export const INDEXABLE_ROUTES = [
  "/",
  "/about",
  "/analyze-offer",
  "/analyze-salary",
  "/companies",
  "/contribute",
  "/guides",
  "/guides/equity",
  "/guides/negotiation",
  "/guides/pm-compensation-2026",
  "/guides/remote-pay",
  "/guides/startup-vs-bigtech",
  "/guides/swe-compensation-2026",
  "/methodology",
  "/pricing",
  "/privacy",
  "/salaries",
  "/submit",
  "/tools/compare-offers",
  "/tools/compensation-breakdown",
  "/tools/equity-simulator",
  "/tools/inflation-calculator",
  "/tools/negotiation-email",
  "/tools/percentile-calculator",
  "/tools/salary-comparison",
  "/tools/stock-calculator",
] as const;

export function toAbsoluteUrl(path = "/"): string {
  const normalizedPath = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function isIndexablePath(path: string): boolean {
  return !NON_INDEXABLE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
