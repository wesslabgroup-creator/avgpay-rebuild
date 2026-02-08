import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, TrendingUp, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Methodology | AvgPay",
  description: "How AvgPay collects, verifies, and presents salary data. Transparent data sources and confidence scoring.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Our Methodology</h1>
          <p className="text-xl text-slate-400">
            Transparent data sources and confidence scoring
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Database className="w-8 h-8 text-indigo-400 mb-4" />
              <CardTitle>BLS Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Official Bureau of Labor Statistics occupational employment statistics. 
                Updated annually with comprehensive salary data across all U.S. metros.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="w-8 h-8 text-emerald-400 mb-4" />
              <CardTitle>H-1B Filings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Publicly disclosed salary data from visa applications. Legally required 
                to be accurate and updated quarterly from DOL databases.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="w-8 h-8 text-violet-400 mb-4" />
              <CardTitle>Pay Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">
                Live data from pay transparency law job postings in CA, NY, CO, and WA. 
                Real-time market rates from actual job openings.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Confidence Scoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-400">
              We assign confidence scores based on data volume and source quality:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <span><strong>High (N&gt;50):</strong> Statistically significant sample size across multiple sources</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                <span><strong>Medium (N&gt;10):</strong> Sufficient data for directional guidance</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <span><strong>Low (N&lt;10):</strong> Limited data - use as rough estimate only</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Processing Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-400">
            <ol className="space-y-2 list-decimal list-inside">
              <li><strong>Ingest:</strong> Daily automated scrapers pull from 100+ company career pages</li>
              <li><strong>Normalize:</strong> Job titles mapped to canonical roles, locations to metro areas</li>
              <li><strong>Validate:</strong> Outlier detection against BLS benchmarks (3-sigma rule)</li>
              <li><strong>Merge:</strong> Deduplication across sources, weighted by confidence</li>
              <li><strong>Publish:</strong> Only data meeting quality thresholds goes live</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
