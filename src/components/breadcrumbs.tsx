"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/admin", "/dashboard", "/auth", "/login", "/signup", "/api"];

const labelMap: Record<string, string> = {
  salaries: "Salaries",
  companies: "Companies",
  compare: "Comparisons",
  guides: "Guides",
  tools: "Tools",
  methodology: "Methodology",
  privacy: "Privacy",
  submit: "Submit Salary",
  contribute: "Contribute",
  pricing: "Pricing",
  about: "About",
  "analyze-offer": "Analyze Offer",
  "analyze-salary": "Analyze Salary",
};

function toLabel(segment: string) {
  if (labelMap[segment]) {
    return labelMap[segment];
  }

  return segment
    .replace(/-/g, " ")
    .split(" ")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

export function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname || pathname === "/" || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="border-b border-slate-200 bg-slate-50/80">
      <nav aria-label="Breadcrumb" className="max-w-6xl mx-auto px-4 sm:px-6 py-3 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
          </li>
          {segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;

            return (
              <li key={href} className="inline-flex items-center gap-1.5">
                <span aria-hidden="true">/</span>
                {isLast ? (
                  <span className="font-medium text-slate-800">{toLabel(segment)}</span>
                ) : (
                  <Link href={href} className="hover:text-emerald-700 transition-colors">{toLabel(segment)}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
