"use client";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";

interface CompareConversionCTAProps {
  compareSlug: string;
}

export function CompareConversionCTA({ compareSlug }: CompareConversionCTAProps) {
  const posthog = usePostHog();

  const trackClick = (target: "analyze-offer" | "analyze-salary") => {
    posthog?.capture("compare_cta_clicked", {
      target,
      source: "comparison_page",
      compare_slug: compareSlug,
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <Link href="/analyze-offer" onClick={() => trackClick("analyze-offer")}>
        <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 sm:w-auto">
          Analyze this offer
        </Button>
      </Link>
      <Link href="/analyze-salary" onClick={() => trackClick("analyze-salary")}>
        <Button size="lg" variant="outline" className="w-full sm:w-auto">
          Analyze your salary
        </Button>
      </Link>
    </div>
  );
}
