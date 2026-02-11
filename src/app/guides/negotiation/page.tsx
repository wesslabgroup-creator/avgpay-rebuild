// avgpay/src/app/guides/negotiation/page.tsx
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
  Gavel,
  Search,
  Copy,
  HeartHandshake,
  Handshake,
} from "lucide-react";

// Placeholder data for DataTable - illustrating negotiation leverage points
const negotiationHeaders = [
  { key: "factor", label: "Negotiation Factor" },
  { key: "impact", label: "Impact Level" },
  { key: "notes", label: "Notes" },
];

const negotiationRows = [
  ["Experience Level", "High", "Seniority often commands higher salary bands."],
  ["Market Demand", "High", "Roles with high demand offer more negotiation power."],
  ["Skills & Certifications", "Medium", "Specialized skills can justify higher compensation."],
  ["Company Type", "Medium", "Startups vs. Big Tech compensation structures differ significantly."],
  ["Location", "Medium", "Cost of living and local market rates play a role."],
];

const faqs = [
  { question: "When should I negotiate my salary?", answer: "The optimal times are usually during a job offer, annual performance reviews, or when taking on significant new responsibilities. Be prepared." },
  { question: "What if the company says their offer is final?", answer: "Acknowledge their position, but restate your case by highlighting your unique value proposition and market research. If still firm, consider other aspects of the total compensation package." },
  { question: "How do I research salary ranges?", answer: "Utilize online resources like AvgPay, Glassdoor, Levels.fyi, and industry-specific reports. Network with peers for insights." },
  { question: "Should I mention my current salary?", answer: "In many regions, it's illegal for employers to ask for salary history. Focus on your desired salary based on market value and contribution, not past earnings." },
];

export const metadata: Metadata = {
  title: "Salary Negotiation Guide | AvgPay",
  description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
  keywords: "salary negotiation, job offer negotiation, how to negotiate salary, tech salary negotiation, compensation negotiation, career advice",
  openGraph: {
    title: "Salary Negotiation Guide | AvgPay",
    description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
    type: "article",
    publishedTime: "2026-02-10T09:46:00Z",
    images: [], // Add image URLs if available
  },
  twitter: {
    card: "summary_large_image",
    title: "Salary Negotiation Guide | AvgPay",
    description: "Master the art of salary negotiation. Learn strategies, tips, and common pitfalls to secure the compensation you deserve.",
  },
};

const NegotiationPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <ArticleSchema
        headline="Salary Negotiation Guide"
        datePublished="2026-02-10"
        authorName="AvgPay Team"
      />

      <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
        Mastering Salary Negotiation
      </h1>
      <p className="mb-8 text-lg text-gray-600">
        Equip yourself with the knowledge and strategies to confidently negotiate your compensation and achieve your career goals.
      </p>

      <div className="mb-12 grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <Handshake className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">What You&apos;ll Learn</h3>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>Key negotiation principles and strategies.</li>
              <li>How to research and determine your market value.</li>
              <li>Effective communication techniques during negotiation.</li>
              <li>Negotiating beyond base salary (bonuses, equity, benefits).</li>
              <li>Common negotiation mistakes to avoid.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 bg-blue-50 border border-blue-200 shadow-inner">
            <div className="flex items-center mb-3">
              <Gavel className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-semibold text-blue-800">Executive Summary</h3>
            </div>
            <p className="text-gray-800">
              Negotiation is a critical skill for career advancement and financial well-being. This guide demystifies the negotiation process, providing actionable steps and proven strategies to help you secure fair compensation. By understanding market dynamics, preparing thoroughly, and communicating effectively, you can significantly increase your earning potential.
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Factors Influencing Your Negotiation Power</h2>
        <p className="mb-4 text-gray-700">
          Understanding the elements that impact your leverage is key to successful negotiation.
        </p>
        <DataTable headers={negotiationHeaders} rows={negotiationRows} />
        <div className="mt-4 flex justify-center">
          <Link href="/analyze-offer" legacyBehavior>
            <Button variant="outline" className="group">
              Get Your Personalized Analyzer <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Key Takeaways for Negotiation</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <DollarSign className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Research is Paramount</h3>
              </div>
              <p className="text-gray-700">Know your worth. Thorough research into market rates and company compensation practices is your strongest asset.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Handshake className="h-6 w-6 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Practice Your Pitch</h3>
              </div>
              <p className="text-gray-700">Rehearse your talking points both mentally and out loud to build confidence and clarity.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <Gavel className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Focus on Total Compensation</h3>
              </div>
              <p className="text-gray-700">Consider base salary, bonus potential, equity, benefits, and professional development opportunities.</p>
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
              <strong>Be Confident, Not Demanding:</strong> Present your case with data and assertiveness, but maintain professionalism.
            </p>
          </div>
          <div className="flex items-start">
            <Copy className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Ask for Time to Consider:</strong> It&apos;s okay to ask for 24-48 hours to review an offer carefully.
            </p>
          </div>
          <div className="flex items-start">
            <Search className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Identify Your Priorities:</strong> Know what aspects of compensation are most important to you before you start negotiating.
            </p>
          </div>
          <div className="flex items-start">
            <HeartHandshake className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-gray-700">
              <strong>Build Rapport:</strong> Negotiation is a conversation. Aim for a win-win outcome that benefits both you and the employer.
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

      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">Ready to Negotiate Like a Pro?</h2>
        <p className="mb-8 text-lg text-gray-700">
          Use our advanced analyzer to get personalized negotiation strategies and benchmark your target compensation.
        </p>
        <Link href="/analyze-offer" legacyBehavior>
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
          <Link href="/guides/negotiation" className="font-semibold text-blue-600">Negotiation Guide</Link>
          <Link href="/guides/equity" className="hover:underline">Equity Guide</Link>
          <Link href="/guides/remote-pay" className="hover:underline">Remote Pay Guide</Link>
          <Link href="/guides/startup-vs-bigtech" className="hover:underline">Startup vs. Big Tech</Link>
        </div>
      </footer>
    </div>
  );
};

export default NegotiationPage;