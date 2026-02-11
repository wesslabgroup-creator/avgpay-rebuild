import { Metadata } from "next";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  type?: "website" | "article";
  publishedAt?: string;
}

export function generatePageMeta({
  title,
  description,
  path = "",
  type = "website",
  publishedAt,
}: PageMetaProps): Metadata {
  const url = getAbsoluteUrl(path);
  
  return {
    title: `${title} | AvgPay`,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | AvgPay`,
      description,
      url,
      type,
      siteName: "AvgPay",
      ...(publishedAt && { publishedTime: publishedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AvgPay`,
      description,
    },
  };
}

export function generateSalaryPageMeta(
  company: string,
  role: string,
  location: string,
  medianSalary: number
): Metadata {
  const title = `${role} Salary at ${company} in ${location}`;
  const description = `The median ${role} salary at ${company} in ${location} is $${medianSalary.toLocaleString()}. Compare against market data from BLS, H-1B filings, and pay transparency laws.`;
  
  return generatePageMeta({
    title,
    description,
    path: `/${encodeURIComponent(company)}/${encodeURIComponent(role)}/${encodeURIComponent(location)}`,
  });
}
