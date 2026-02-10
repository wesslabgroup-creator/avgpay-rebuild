"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CompanyError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Company page error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-slate-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-slate-900">Failed to Load Company Data</CardTitle>
          <CardDescription className="text-slate-600">
            We couldn't load the company information. This might be a temporary issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Link href="/companies" className="w-full">
              <Button variant="outline" className="w-full border-slate-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                View All Companies
              </Button>
            </Link>
          </div>
          <div className="text-center text-sm text-slate-500">
            If the problem persists, the company data might not be available yet.
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
