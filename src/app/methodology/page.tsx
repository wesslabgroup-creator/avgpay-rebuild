import { Metadata } from "next";
import Link from "next/link";
import { Database, Shield, CheckCircle2, TrendingUp, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Methodology - AvgPay",
  description: "How AvgPay collects, verifies, and presents salary data. BLS, H-1B, and pay transparency laws.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-surface-subtle pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-text-primary">Our Methodology</h1>
          <p className="text-xl text-text-secondary">
            How we collect, verify, and present salary data you can trust.
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Sources */}
          <section className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Data Sources</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>
                <strong>U.S. Bureau of Labor Statistics (BLS):</strong> Official government wage data 
                by occupation and geographic area. Updated annually.
              </p>
              <p>
                <strong>H-1B Visa Data:</strong> Publicly available wage data from H-1B visa 
                applications, showing actual salaries employers pay for specific roles.
              </p>
              <p>
                <strong>State Pay Transparency Laws:</strong> Salary ranges voluntarily disclosed 
                by employers in compliance with state transparency requirements.
              </p>
            </div>
          </section>

          {/* Verification Process */}
          <section className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Verification Process</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Cross-Reference</h3>
                <p className="text-sm text-text-secondary">We compare multiple sources to identify discrepancies and outliers.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Normalize</h3>
                <p className="text-sm text-text-secondary">Job titles and locations standardized for accurate comparisons.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-subtle rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Validate</h3>
                <p className="text-sm text-text-secondary">Minimum sample thresholds ensure statistical significance.</p>
              </div>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Update Frequency</h2>
            </div>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <span><strong>BLS Data:</strong> Updated annually (latest release)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <span><strong>H-1B Data:</strong> Quarterly updates from USCIS releases</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5" />
                <span><strong>User Contributions:</strong> Reviewed within 48 hours</span>
              </li>
            </ul>
          </section>

          {/* Transparency */}
          <section className="bg-surface rounded-xl shadow-sm border border-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-text-primary">Transparency</h2>
            </div>
            <div className="space-y-4 text-text-secondary">
              <p>
                We show our work. Every salary estimate includes the number of data points 
                used and confidence level. We never hide sample sizes or inflate accuracy.
              </p>
              <p>
                <strong>Our commitment:</strong> If data quality is insufficient for a 
                role/location, we say so explicitly rather than showing unreliable estimates.
              </p>
              <div className="bg-surface-subtle p-4 rounded-lg mt-4">
                <p className="text-sm text-text-secondary">
                  Have questions about our methodology?{' '}
                  <Link href="/about" className="text-primary hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
