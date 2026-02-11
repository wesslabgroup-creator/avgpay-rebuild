import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | AvgPay",
  description: "How AvgPay collects, uses, and protects your data. We prioritize your privacy.",
  openGraph: {
    title: "Privacy Policy | AvgPay",
    description: "Learn about AvgPay's commitment to privacy and data protection.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-text-primary">Privacy Policy</h1>
            <p className="text-lg text-text-secondary">
              Last updated: February 10, 2026
            </p>
          </div>

          <div className="prose max-w-none">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-text-primary">Overview</h2>
              <p className="text-text-secondary leading-relaxed">
                AvgPay (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our
                website and services.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-text-primary">Information You Provide</h3>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>
                  <strong>Offer Analysis Data:</strong> When you use our offer analyzer tool, you voluntarily
                  provide job details (company, role, location, salary information). This data is processed
                  client-side and is not stored on our servers unless you explicitly submit it for future reference.
                </li>
                <li>
                  <strong>Email Address:</strong> If you sign up for our mailing list or create an account,
                  we collect your email address to send you updates, tips, and relevant information.
                </li>
                <li>
                  <strong>Contributed Salary Data:</strong> If you voluntarily submit salary information through
                  our contribution form, we collect that data to improve our benchmarks. All contributions are
                  anonymized before being added to our database.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mt-6">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>
                  <strong>Usage Data:</strong> We collect information about how you interact with our website,
                  including pages visited, time spent, and features used. This is collected via Google Analytics.
                </li>
                <li>
                  <strong>Device Information:</strong> We may collect information about your device, browser type,
                  operating system, and IP address for analytics and security purposes.
                </li>
                <li>
                  <strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your
                  experience and analyze site usage.
                </li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>To provide and maintain our salary analysis tools and services</li>
                <li>To improve and optimize our website and user experience</li>
                <li>To send you email communications (if you&apos;ve opted in)</li>
                <li>To aggregate and anonymize data for market research and benchmarking</li>
                <li>To detect and prevent fraud, abuse, and security incidents</li>
                <li>To comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Data Privacy Commitments</h2>
              <div className="bg-primary-subtle border border-primary-subtle rounded-lg p-6 space-y-3">
                <p className="text-text-primary font-semibold">We prioritize your privacy:</p>
                <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                  <li>
                    <strong>No Personal Salary Storage:</strong> When you analyze an offer, we do not store your
                    personal salary details on our servers unless you explicitly save them to your account.
                  </li>
                  <li>
                    <strong>Anonymization:</strong> All contributed salary data is anonymized and aggregated.
                    We never associate salary information with personally identifiable information.
                  </li>
                  <li>
                    <strong>No Data Selling:</strong> We do not sell, rent, or trade your personal information
                    to third parties. Ever.
                  </li>
                  <li>
                    <strong>Minimal Data Collection:</strong> We only collect data necessary to provide and
                    improve our services.
                  </li>
                </ul>
              </div>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Data Sharing and Disclosure</h2>
              <p className="text-text-secondary leading-relaxed">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>
                  <strong>Service Providers:</strong> We may share data with third-party service providers
                  (e.g., analytics tools, email services) who assist us in operating our website. These providers
                  are contractually obligated to protect your data.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law, court order,
                  or government regulation.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale,
                  your information may be transferred. We will notify you before your data is transferred and
                  becomes subject to a different privacy policy.
                </li>
              </ul>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Data Security</h2>
              <p className="text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your information
                from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission
                over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Your Rights</h2>
              <p className="text-text-secondary leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails at any time</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:privacy@avgpay.com" className="text-primary hover:text-primary-hover font-semibold">
                  privacy@avgpay.com
                </a>
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Cookies and Tracking</h2>
              <p className="text-text-secondary leading-relaxed">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our website</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                You can control cookies through your browser settings. Note that disabling cookies may limit
                some functionality of our website.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Third-Party Services</h2>
              <p className="text-text-secondary leading-relaxed">
                We use the following third-party services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-text-secondary">
                <li><strong>Google Analytics:</strong> For website analytics and usage tracking</li>
                <li><strong>Vercel:</strong> For website hosting and content delivery</li>
                <li><strong>Supabase:</strong> For database storage and authentication</li>
              </ul>
              <p className="text-text-secondary leading-relaxed mt-4">
                These services have their own privacy policies governing their use of your information.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Children&apos;s Privacy</h2>
              <p className="text-text-secondary leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly collect
                personal information from children. If you believe we have inadvertently collected information
                from a child, please contact us immediately.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Changes to This Policy</h2>
              <p className="text-text-secondary leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                by posting the new policy on this page and updating the &quot;Last updated&quot; date. We encourage you
                to review this policy periodically.
              </p>
            </section>

            <section className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-text-primary">Contact Us</h2>
              <p className="text-text-secondary leading-relaxed">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-surface-subtle rounded-lg p-6 mt-4">
                <p className="text-text-secondary">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:privacy@avgpay.com" className="text-primary hover:text-primary-hover font-semibold">
                    privacy@avgpay.com
                  </a>
                </p>
                <p className="text-text-secondary mt-2">
                  <strong>Website:</strong>{" "}
                  <Link href="/" className="text-primary hover:text-primary-hover font-semibold">
                    https://avgpay-rebuild.vercel.app
                  </Link>
                </p>
              </div>
            </section>
          </div>

          <div className="pt-8 border-t border-border">
            <Link href="/" className="text-primary hover:text-primary-hover font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
