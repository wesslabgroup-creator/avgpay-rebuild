"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JobError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Job page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-error-subtle rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-error" />
          </div>
          <CardTitle className="text-2xl text-text-primary">Failed to Load Job Data</CardTitle>
          <CardDescription className="text-text-secondary">
            We couldn&apos;t load the salary information for this role. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-primary hover:bg-primary-hover"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/salaries" className="w-full">
              <Button variant="outline" className="w-full border-border">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse All Salaries
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-text-muted">
            If the problem persists, this role might not have enough data yet.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
