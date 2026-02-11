import Link from "next/link";

const footerSections = [
  {
    title: "Explore Salaries",
    links: [
      { href: "/salaries", label: "Salary Database" },
      { href: "/companies", label: "Company Salary Pages" },
      { href: "/compare", label: "Compensation Comparisons" },
      { href: "/analyze-salary", label: "Salary Analyzer" },
    ],
  },
  {
    title: "Guides & Strategy",
    links: [
      { href: "/guides", label: "Compensation Guides Hub" },
      { href: "/guides/negotiation", label: "Negotiation Guide" },
      { href: "/guides/equity", label: "Equity Guide" },
      { href: "/guides/startup-vs-bigtech", label: "Startup vs Big Tech" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools", label: "Tools Hub" },
      { href: "/tools/compare-offers", label: "Compare Offers Tool" },
      { href: "/tools/compensation-breakdown", label: "Compensation Breakdown Calculator" },
      { href: "/tools/stock-calculator", label: "Stock Compensation Calculator" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/submit", label: "Submit Salary Data" },
      { href: "/methodology", label: "Data Methodology" },
      { href: "/about", label: "About AvgPay" },
      { href: "/privacy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700 mb-3">{section.title}</h2>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-600 hover:text-emerald-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-8">© {new Date().getFullYear()} AvgPay. Compensation data and calculators for tech careers.</p>
      </div>
    </footer>
  );
}
