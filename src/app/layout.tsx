import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "AvgPay - Salary Insights & Negotiation Tools",
    template: "%s | AvgPay",
  },
  description: siteConfig.description,
  alternates: {
    canonical: getAbsoluteUrl("/"),
  },
  openGraph: {
    title: "AvgPay - Salary Insights & Negotiation Tools",
    description: siteConfig.description,
    type: "website",
    url: getAbsoluteUrl("/"),
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "AvgPay - Salary Insights & Negotiation Tools",
    description: siteConfig.description,
  },
};

import { Navigation } from "@/components/navigation";
import { OrganizationSchema } from "@/components/schema-markup";

import { CSPostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white text-slate-900 pt-20`}>
        <CSPostHogProvider>
          <OrganizationSchema />
          <Navigation />
          {children}
        </CSPostHogProvider>
      </body>
    </html>
  );
}
