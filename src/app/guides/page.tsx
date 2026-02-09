import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Salary Guides | AvgPay",
  description: "Comprehensive guides to tech compensation and negotiation.",
};

const GUIDES = [
  {
    title: "Product Manager Compensation Guide 2026",
    description: "Complete breakdown of PM salaries across levels, companies, and locations. Includes equity ranges and negotiation strategies.",
    slug: "pm-compensation-2026",
    readTime: "15 min",
    category: "Role-Specific",
  },
  {
    title: "How to Negotiate Tech Offers",
    description: "Data-driven strategies for negotiating compensation. When to push, what to ask for, and how to handle competing offers.",
    slug: "negotiation",
    readTime: "12 min",
    category: "Strategy",
  },
  {
    title: "Understanding Tech Equity",
    description: "RSUs vs options, vesting schedules, 409A valuations, and tax implications. Everything you need to evaluate equity offers.",
    slug: "equity",
    readTime: "18 min",
    category: "Education",
  },
  {
    title: "Software Engineer Salary Guide 2026",
    description: "From L3 to Staff+. Compensation breakdowns at Google, Meta, Amazon, and startups. Plus leveling guides.",
    slug: "swe-compensation-2026",
    readTime: "20 min",
    category: "Role-Specific",
  },
  {
    title: "The Remote Work Pay Cut Myth",
    description: "Analyzing 10,000+ remote vs in-office salaries. Is location-based pay still justified in 2026?",
    slug: "remote-pay",
    readTime: "10 min",
    category: "Research",
  },
  {
    title: "Startup vs Big Tech Compensation",
    description: "When does startup equity beat FAANG total comp? A probabilistic analysis with real data.",
    slug: "startup-vs-bigtech",
    readTime: "14 min",
    category: "Strategy",
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">Salary Guides</h1>
            <p className="text-xl text-slate-600">
              Data-driven insights for tech professionals
            </p>
          </div>

          <div className="grid gap-6">
            {GUIDES.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="hover:border-indigo-500 transition-colors cursor-pointer bg-slate-900 border-slate-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-slate-900">{guide.title}</CardTitle>
                      <span className="text-sm px-3 py-1 rounded-full bg-slate-800 text-slate-600">
                        {guide.category}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-2">{guide.description}</p>
                    <p className="text-sm text-slate-500">{guide.readTime} read</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
