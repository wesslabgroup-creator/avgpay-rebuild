import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, TrendingUp, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Methodology | AvgPay",
  description: "How AvgPay collects, verifies, and presents salary data. Transparent data sources and confidence scoring.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white">
      
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">Our Methodology</h1>
            <p className="text-xl text-slate-600">
              Transparent data sources and confidence scoring
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-200">
              <CardHeader>
                <Database className="w-8 h-8 text-indigo-400 mb-4" />
                <CardTitle className="text-slate-900">BLS Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Official Bureau of Labor Statistics occupational employment statistics. 
                  Updated annually with comprehensive salary data across all U.S. metros.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-200">
              <CardHeader>
                <Shield className="w-8 h-8 text-emerald-400 mb-4" />
                <CardTitle className="text-slate-900">H-1B Filings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Publicly disclosed salary data from visa applications. Legally required 
                  to be accurate and updated quarterly from DOL databases.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-200">
              <CardHeader>
                <TrendingUp className="w-8 h-8 text-violet-400 mb-4" />
                <CardTitle className="text-slate-900">Pay Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Live data from pay transparency law job postings in CA, NY, CO, and WA. 
                  Real-time market rates from actual job openings.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Confidence Scoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                We assign confidence scores based on data volume and source quality:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span className="text-slate-300"><strong>High (N&gt;50):</strong> Statistically significant sample size across multiple sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <span className="text-slate-300"><strong>Medium (N&gt;10):</strong> Sufficient data for directional guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <span className="text-slate-300"><strong>Low (N&lt;10):</strong> Limited data - use as rough estimate only</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Data Processing Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <ol className="space-y-2 list-decimal list-inside">
                <li><strong className="text-slate-300">Ingest:</strong> Daily automated scrapers pull from 100+ company career pages</li>
                <li><strong className="text-slate-300">Normalize:</strong> Job titles mapped to canonical roles, locations to metro areas</li>
                <li><strong className="text-slate-300">Validate:</strong> Outlier detection against BLS benchmarks (3-sigma rule)</li>
                <li><strong className="text-slate-300">Merge:</strong> Deduplication across sources, weighted by confidence</li>
                <li><strong className="text-slate-300">Publish:</strong> Only data meeting quality thresholds goes live</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
