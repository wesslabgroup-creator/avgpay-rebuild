import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About | AvgPay",
  description: "Our mission to bring transparency to tech compensation.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">

      <div className="px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">About AvgPay</h1>
            <p className="text-xl text-text-secondary">
              Bringing transparency to tech compensation
            </p>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-text-secondary leading-relaxed">
              We believe everyone deserves to know their market value. The salary negotiation
              process is broken—opaque, stressful, and unfair. We&apos;re fixing it with data.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Our Mission</h2>
            <p className="text-text-secondary leading-relaxed">
              Democratize access to compensation data so every tech worker can negotiate
              with confidence. No more guessing. No more leaving money on the table.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Privacy First</h2>
            <p className="text-text-secondary leading-relaxed">
              We don&apos;t store personal information. All salary data is anonymized.
              We don&apos;t sell your data to recruiters or employers. This is a tool
              built for workers, not corporations.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-text-primary">Open Data</h2>
            <p className="text-text-secondary leading-relaxed">
              We aggregate publicly available data from BLS, H-1B filings, and pay
              transparency laws. We believe compensation information should be as
              accessible as stock prices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">47K+ (Beta)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Aggregated data points</p>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">100+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Tech companies tracked</p>
              </CardContent>
            </Card>

            <Card className="bg-surface border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-4xl font-bold text-primary">25+</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Metro areas covered</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/contribute" className="text-primary hover:text-primary-hover font-semibold">
              Help us grow the database →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
