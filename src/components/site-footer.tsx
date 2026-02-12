import Link from "next/link";

const footerSections = [
  {
    title: "Salary Research",
    links: [
      { href: "/salaries", label: "Salary Database" },
      { href: "/companies", label: "Company Pay Pages" },
      { href: "/compare", label: "Offer Comparisons" },
      { href: "/methodology", label: "Methodology" },
    ],
  },
  {
    title: "Guides & Tools",
    links: [
      { href: "/guides", label: "All Compensation Guides" },
      { href: "/tools", label: "All Salary Tools" },
      { href: "/tools/negotiation-email", label: "Negotiation Email Generator" },
      { href: "/tools/compensation-breakdown", label: "Compensation Breakdown Calculator" },
    ],
  },
  {
    title: "Conversion Paths",
    links: [
      { href: "/analyze-offer", label: "Analyze My Offer" },
      { href: "/analyze-salary", label: "Check My Market Value" },
      { href: "/submit", label: "Submit Compensation Data" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About AvgPay" },
      { href: "/methodology", label: "Methodology" },
      { href: "/data-policy", label: "Data Policy" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/contact", label: "Contact" },
      { href: "/contribute", label: "Contribute" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerSections.map((section) => (
            <section key={section.title} aria-label={section.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-600 hover:text-emerald-700 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-sm text-slate-500">© {new Date().getFullYear()} AvgPay. Compensation clarity for tech workers.</p>
      </div>
    </footer>
  );
}
