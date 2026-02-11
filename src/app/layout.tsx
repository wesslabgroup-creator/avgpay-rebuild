import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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

import { CSPostHogProvider } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-surface text-text-primary pt-20`}>
        <CSPostHogProvider>
          <OrganizationSchema />
          <Navigation />
          {children}
        </CSPostHogProvider>
      </body>
    </html>
  );
}
