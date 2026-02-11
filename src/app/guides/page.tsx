import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CURATED_COMPARISONS } from "@/app/compare/data/curated-comparisons";
import { 
  Briefcase, 
  TrendingUp, 
  BookOpen, 
  Code2, 
  Globe, 
  Scale,
  ArrowRight,
  Clock,
  Target,
  DollarSign
} from "lucide-react";

export const metadata: Metadata = {
  title: "Salary Guides | AvgPay",
  description: "Expert guides to tech compensation, negotiation, and career growth.",
};

const GUIDES = [
  {
    title: "Product Manager Compensation Guide 2026",
    hook: "PMs at Stripe earn 40% more than at Series B startups. See the full breakdown.",
    valueProp: "Know exactly what to ask for at every level",
    slug: "pm-compensation-2026",
    readTime: "15 min",
    category: "Role-Specific",
    icon: Briefcase,
    color: "blue",
    highlights: ["Level-by-level salaries", "Equity ranges by stage", "Negotiation scripts"],
  },
  {
    title: "How to Negotiate Tech Offers",
    hook: "The average engineer leaves $23K on the table. Don't be average.",
    valueProp: "Get the exact words to use in every negotiation scenario",
    slug: "negotiation",
    readTime: "12 min",
    category: "Strategy",
    icon: TrendingUp,
    color: "emerald",
    highlights: ["Counteroffer templates", "Competing offer tactics", "Timeline strategies"],
  },
  {
    title: "Understanding Tech Equity",
    hook: "RSUs vs options could mean $500K difference over 4 years.",
    valueProp: "Finally understand what your equity package is actually worth",
    slug: "equity",
    readTime: "18 min",
    category: "Education",
    icon: BookOpen,
    color: "purple",
    highlights: ["RSU vs options calculator", "Tax implications", "Vesting strategies"],
  },
  {
    title: "Software Engineer Salary Guide 2026",
    hook: "L5 at Google pays $380K. L5 at a startup? It depends. Here's the full map.",
    valueProp: "See the money path from Junior to Staff+ Engineer",
    slug: "swe-compensation-2026",
    readTime: "20 min",
    category: "Role-Specific",
    icon: Code2,
    color: "indigo",
    highlights: ["Big Tech vs startup pay", "Leveling guides", "Location adjustments"],
  },
  {
    title: "The Remote Work Pay Cut Myth",
    hook: "Remote workers at top companies now earn within 5% of SF-based peers.",
    valueProp: "Know when location-based pay is (and isn't) negotiable",
    slug: "remote-pay",
    readTime: "10 min",
    category: "Research",
    icon: Globe,
    color: "teal",
    highlights: ["Remote pay trends 2026", "Geo-arbitrage opportunities", "Companies that pay global rates"],
  },
  {
    title: "Startup vs Big Tech Compensation",
    hook: "Startup equity has a 90% failure rate. Here's when it still makes sense.",
    valueProp: "Calculate the real expected value of startup offers",
    slug: "startup-vs-bigtech",
    readTime: "14 min",
    category: "Strategy",
    icon: Scale,
    color: "amber",
    highlights: ["Expected value calculator", "Risk assessment framework", "When to join Series A vs Series C"],
  },
];

const iconColorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  emerald: "bg-emerald-100 text-emerald-700",
  purple: "bg-purple-100 text-purple-700",
  indigo: "bg-indigo-100 text-indigo-700",
  teal: "bg-teal-100 text-teal-700",
  amber: "bg-amber-100 text-amber-700",
};

const categoryColors: Record<string, string> = {
  "Role-Specific": "bg-blue-100 text-slate-800 border-blue-200",
  "Strategy": "bg-emerald-100 text-slate-800 border-emerald-200",
  "Education": "bg-purple-100 text-slate-800 border-purple-200",
  "Research": "bg-teal-100 text-slate-800 border-teal-200",
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
              <Target className="w-4 h-4" />
              <span>6 Data-Driven Guides</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Salary Guides That<br className="hidden sm:block" /> Actually Help You
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Real numbers. Real strategies. No fluff. Everything you need to negotiate 
              with confidence and maximize your career earnings.
            </p>
          </div>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-6 md:gap-8">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link key={guide.slug} href={`/guides/${guide.slug}`}>
                <Card className="group hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer bg-white border-slate-200">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Left: Visual */}
                      <div className="sm:w-16 md:w-20 flex-shrink-0 flex items-start justify-center pt-6 sm:pt-8 px-6 sm:px-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClasses[guide.color]}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                      
                      {/* Middle: Content */}
                      <div className="flex-1 px-6 py-6 sm:py-8">
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[guide.category]}`}>
                            {guide.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {guide.readTime} read
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                          {guide.title}
                        </h2>
                        
                        {/* Hook - the attention grabber */}
                        <p className="text-slate-900 font-medium mb-2">
                          {guide.hook}
                        </p>
                        
                        {/* Value Prop */}
                        <p className="text-slate-600 mb-4">
                          {guide.valueProp}
                        </p>
                        
                        {/* Highlights - scannable key takeaways */}
                        <div className="flex flex-wrap gap-2">
                          {guide.highlights.map((highlight) => (
                            <span 
                              key={highlight}
                              className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right: CTA */}
                      <div className="hidden sm:flex flex-shrink-0 items-center px-6 border-l border-slate-100">
                        <div className="text-emerald-600 flex items-center gap-1 font-medium group-hover:gap-2 transition-all">
                          <span className="text-sm">Read</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Popular comparison pages</h2>
          <p className="text-slate-600 mb-6">
            Pair these guides with side-by-side compensation matchups for the most in-demand company and role combinations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURATED_COMPARISONS.slice(0, 4).map((comparison) => (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-4 hover:border-emerald-300 transition-colors"
              >
                <p className="font-semibold text-slate-900 group-hover:text-emerald-600">{comparison.title}</p>
                <p className="text-sm text-slate-500 mt-1">{comparison.summary}</p>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-slate-50 rounded-2xl p-8 sm:p-12 border border-slate-200">
            <div className="flex items-center justify-center gap-2 mb-4">
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Ready to negotiate your next offer?
            </h3>
            <p className="text-slate-600 mb-6 max-w-lg mx-auto">
              Use our free Offer Analyzer to see how your compensation compares 
              to thousands of verified salaries.
            </p>
            <Link 
              href="/analyze-offer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Analyze My Offer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
