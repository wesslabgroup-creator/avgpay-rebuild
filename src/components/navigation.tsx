"use client";

import Link from "next/link";
import { useState } from "react";
import { Database, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/salaries", label: "Salaries" },
    { href: "/guides", label: "Guides" },
    { href: "/methodology", label: "Methodology" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contribute", label: "Contribute" },
  ];

  return (
    <>
      <nav className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Database className="w-6 h-6 text-indigo-400" />
            <span className="text-gradient">AvgPay</span>
          </Link>
          <div className="flex items-center gap-6">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {links.slice(1).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
            {/* Mobile Hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden ml-2"
              onClick={() => setIsOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-8 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="w-fit"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 text-lg">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "text-slate-300 hover:text-slate-100 transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50",
                    href === "/" ? "text-xl font-bold border-l-4 border-indigo-400 pl-4" : ""
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
