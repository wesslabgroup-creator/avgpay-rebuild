export const siteConfig = {
  name: "AvgPay",
  description:
    "Data-driven salary insights for tech workers. Compare compensation with BLS, H-1B, and pay-transparency data.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://avgpay.com",
};

export function getAbsoluteUrl(path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath === "/" ? "" : normalizedPath}`;
}
