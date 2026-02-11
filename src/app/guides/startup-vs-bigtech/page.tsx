// avgpay/src/app/guides/startup-vs-bigtech/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { ArticleSchema } from "@/components/schema-markup";
import { Card, CardContent } from "@/components/ui/card";
import { ExpandableFAQ } from "@/components/ExpandableFAQ";
import {
  Lightbulb,
  ArrowRight,
  DollarSign,
  Briefcase,
  ChartLine,
  Gavel,
  Search,
  Copy,
  Building,
  Asterisk,
} from "lucide-react";

const startupBigTechHeaders = [
  { key: "aspect", label: "Aspect" },
  { key: "startup", label: "Startup" },
  { key: "bigTech", label: "Big Tech" },
  { key: "notes", label: "Notes" },
];

const startupBigTechRows = [
  ["Base Salary (Senior IC SWE)", "$170k-$210k median base", "$220k-$280k median base", "Carta Total Compensation + Levels.fyi medians (2025)."],
  ["Annual Bonus Target", "0%-10% typical", "15%-25% typical", "Pave and SEC proxy disclosures for large public tech companies."],
  ["Equity Vehicle", "Stock options (higher variance)", "RSUs (lower variance)", "Carta startup equity plans vs. public company comp disclosures."],
  ["Liquidity Timeline", "Often 7-10 years to exit event", "Quarterly vest/sell after lockups", "Carta liquidity research + public company trading mechanics."],
  ["Offer Volatility", "Higher during fundraising cycles", "Lower, tied to review cycles", "Pave offer acceptance and rescind trend data (2024-2025)."],
  ["Failure/Downside Risk", "Meaningful probability of zero equity value", "Lower equity wipeout risk", "CB Insights startup failure studies + public market diversification effects."],
];

const faqs = [
  { question: "What is the main difference in compensation between startups and big tech?", answer: "Big Tech generally offers higher base salaries and RSUs, while startups offer potentially higher upside through stock options, but with more risk and often lower base pay." },
  { question: "Which offers better long-term career growth?", answer: "Both offer growth, but in different ways. Startups provide breadth and rapid learning across many functions. Big Tech offers depth, specialization, and structured career paths." },
  { question: "Is startup equity worth the risk?", answer: "It can be, especially if the startup achieves a high valuation or IPO. However, many startups fail, leading to worthless equity. Thorough due diligence is essential." },
  { question: "What kind of roles are common in early-stage startups?", answer: "Early-stage startups often require employees to wear multiple hats, taking on responsibilities across engineering, product, marketing, and operations." },
];

export const metadata: Metadata = {
  title: "Startup vs. Big Tech Compensation Guide | AvgPay",
  description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
  keywords: "startup compensation, big tech salary, tech career, startup vs big tech, employee equity, RSU, stock options, career growth",
  openGraph: {
    title: "Startup vs. Big Tech Compensation Guide | AvgPay",
    description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [{ url: "/images/guides/startup-vs-bigtech-og.svg", width: 1200, height: 630, alt: "Startup vs. Big Tech Compensation Guide" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Startup vs. Big Tech Compensation Guide | AvgPay",
    description: "Compare compensation, culture, and career growth opportunities between startups and established tech giants.",
    images: ["/images/guides/startup-vs-bigtech-og.svg"],
  },
};

const StartupVsBigTechPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Startup vs. Big Tech Compensation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Startup vs. Big Tech: Compensation & Career Paths
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Deciding between the fast-paced world of startups and the established stability of Big Tech? Understand the compensation, culture, and career implications of each.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Compensation differences: salary, bonus, equity.</li>
              <li>Career growth opportunities in both environments.</li>
              <li>Culture and work-life balance comparisons.</li>
              <li>Risk vs. reward in startup equity.</li>
              <li>Choosing the right path for your career goals.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Asterisk className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              The choice between a startup and Big Tech involves trade-offs in compensation, career development, and work environment. Big Tech offers higher base pay and predictable equity, along with structured career paths. Startups provide broader roles, faster learning, and the potential for massive equity gains, albeit with higher risk. Your personal priorities should guide this significant decision.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Compensation Comparison</h2>
        <p className="mb-4 text-gray-700">
          This comparison table uses published benchmarks from compensation platforms, SEC filings, and startup equity studies to quantify the trade-offs.
        </p>
        <DataTable headers={startupBigTechHeaders} rows={startupBigTechRows} />
        <p className="mt-4 text-sm text-gray-600">
          Methodology: We mapped each source to a common senior individual-contributor profile and normalized cash and equity descriptions into comparable ranges.
        </p>
        <div className="mt-4 flex justify-center">
          <Link href="/analyze-offer">
            <Button variant="outline" className="group">
              Get Your Personalized Analyzer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Takeaways</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Financial Upside Potential</h3>
              </div>
              <p className="text-gray-700">Startups offer high-risk, high-reward equity; Big Tech offers more stable, substantial cash compensation.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Briefcase className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Career Trajectory</h3>
              </div>
              <p className="text-gray-700">Startups: broad skills, rapid responsibility. Big Tech: deep specialization, structured progression.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <ChartLine className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Culture & Pace</h3>
              </div>
              <p className="text-gray-700">Startups: fast-paced, agile, often demanding. Big Tech: more structured, established processes, varying pace.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Quick Wins</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Define Your Priorities:</strong> What matters most to you? High salary, equity upside, work-life balance, learning opportunities?
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Research Company Stage:</strong> Understand where a startup is in its funding and growth cycle—this impacts equity value and risk.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Network Extensively:</strong> Talk to people working in both environments to get firsthand accounts of culture and compensation.
            </p>
          </div>
          <div className="flex items-start">
            <Gavel className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Negotiate Wisely:</strong> Tailor your negotiation strategy based on whether you&apos;re joining a startup or a Big Tech firm.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <ExpandableFAQ key={index} question={faq.question} answer={faq.answer} />
        ))}
      </section>

      <section className="mb-12 rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Last updated</h2>
        <p className="text-gray-700">Updated on February 11, 2026. Startup and public-company compensation references are refreshed after each earnings season.</p>
        <h3 className="mb-2 mt-6 text-xl font-semibold text-gray-900">Data sources</h3>
        <ul className="list-disc space-y-2 pl-6 text-gray-700">
          <li>Carta Total Compensation and startup equity benchmarking reports (2025).</li>
          <li>Levels.fyi role-level medians (US, 2025 snapshot).</li>
          <li>Public-company proxy statements (SEC filings) for bonus and equity plan targets.</li>
          <li>CB Insights startup outcomes research for downside-risk context.</li>
        </ul>
      </section>

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Choose Your Path Wisely</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our analyzer to compare offers and understand the implications of joining a startup or Big Tech company.
        </p>
        <Link href="/analyze-offer">
          <Button className="px-8 py-3 text-lg group">
            Go to Analyzer <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </section>

      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>© 2026 AvgPay. All rights reserved.</p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/guides/swe-compensation-2026" className="hover:underline">SWE Compensation 2026</Link>
          <Link href="/guides/pm-compensation-2026" className="hover:underline">PM Compensation 2026</Link>
          <Link href="/guides/negotiation" className="hover:underline">Negotiation Guide</Link>
          <Link href="/guides/equity" className="hover:underline">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="hover:underline">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="font-semibold text-blue-600">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default StartupVsBigTechPage;