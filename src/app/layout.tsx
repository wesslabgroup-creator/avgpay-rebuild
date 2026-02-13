import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL("https://avgpay.com"),
  alternates: { canonical: "/" },
  title: "AvgPay - Know Your Worth in 60 Seconds",
  description: "Data-driven salary insights for tech workers. Compare your compensation against BLS, H-1B, and market data.",
  openGraph: {
    title: "AvgPay - Know Your Worth in 60 Seconds",
    description: "Data-driven salary insights for tech workers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AvgPay - Know Your Worth in 60 Seconds",
    description: "Data-driven salary insights for tech workers",
  },
};

import { Navigation } from "@/components/navigation";
import { OrganizationSchema } from "@/components/schema-markup";
import { SiteFooter } from "@/components/site-footer";

import { CSPostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white text-slate-900 pt-20">
        <CSPostHogProvider>
          <OrganizationSchema />
          <Navigation />
          {children}
          <SiteFooter />
        </CSPostHogProvider>
      </body>
    </html>
  );
}
