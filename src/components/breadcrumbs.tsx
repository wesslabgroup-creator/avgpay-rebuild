import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1 text-slate-500">
        <li>
          <Link href="/" className="inline-flex items-center rounded px-1 py-0.5 hover:text-emerald-700 hover:bg-emerald-50">
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              {item.href && !isLast ? (
                <Link href={item.href} className="rounded px-1 py-0.5 hover:text-emerald-700 hover:bg-emerald-50">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-700" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
