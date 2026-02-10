import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompareConversionCTA } from "@/components/compare-conversion-cta";
import { EmailCapture } from "@/components/email-capture";
import { BreadcrumbSchema, FAQSchema, WebPageSchema } from "@/components/schema-markup";
import { buildComparisonSummary, getEntityValuesByType, resolveCompareEntity, slugifyEntityName } from "@/lib/comparison";
import { getBaseUrl, getFullUrl } from "@/lib/utils";

interface PageProps {
  params: {
    comparisonSlug: string;
  };
}

const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;
const deltaText = (left: number, right: number) => {
  const delta = left - right;
  const pct = right === 0 ? 0 : (delta / right) * 100;
  return `${delta >= 0 ? "+" : ""}${formatCurrency(delta)} (${delta >= 0 ? "+" : ""}${pct.toFixed(1)}%)`;
};

function parseComparisonSlug(comparisonSlug: string) {
  const [leftSlug, rightSlug] = comparisonSlug.split("-vs-");

  if (!leftSlug || !rightSlug) return null;

  const leftEntity = resolveCompareEntity(leftSlug);
  const rightEntity = resolveCompareEntity(rightSlug);

  if (!leftEntity || !rightEntity || leftEntity.type !== rightEntity.type) {
    return null;
  }

  return { leftEntity, rightEntity, comparisonSlug };
}

function metadataForComparison(comparisonSlug: string): Metadata {
  const parsed = parseComparisonSlug(comparisonSlug);

  if (!parsed) {
    return {
      title: "Comparison Not Found | AvgPay",
      description: "The requested salary comparison could not be found.",
    };
  }

  const { leftEntity, rightEntity } = parsed;
  const title = `${leftEntity.name} vs ${rightEntity.name} Salary Comparison`;
  const description = `Compare ${leftEntity.type} compensation benchmarks for ${leftEntity.name} and ${rightEntity.name}, including medians, percentile spreads, and compensation mix insights.`;
  const canonical = `/compare/${comparisonSlug}`;

  return {
    title: `${title} | AvgPay`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${title} | AvgPay`,
      description,
      url: canonical,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AvgPay`,
      description,
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return metadataForComparison(params.comparisonSlug);
}

export async function generateStaticParams() {
  const pairParams: Array<{ comparisonSlug: string }> = [];

  const types: Array<"company" | "role" | "location"> = ["company", "role", "location"];

  for (const type of types) {
    const values = getEntityValuesByType(type);
    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        const left = slugifyEntityName(values[i]);
        const right = slugifyEntityName(values[j]);
        pairParams.push({ comparisonSlug: `${left}-vs-${right}` });
      }
    }
  }

  return pairParams;
}

export default function ComparePage({ params }: PageProps) {
  const parsed = parseComparisonSlug(params.comparisonSlug);

  if (!parsed) notFound();

  const { leftEntity, rightEntity, comparisonSlug } = parsed;
  const leftSummary = buildComparisonSummary(leftEntity);
  const rightSummary = buildComparisonSummary(rightEntity);

  const faqs = [
    {
      question: `How should I interpret ${leftEntity.name} vs ${rightEntity.name} median compensation?`,
      answer: `Use median deltas as a baseline and pair them with percentile and comp mix data to evaluate upside versus stability.`
    },
    {
      question: "Can I use this comparison for negotiation prep?",
      answer: "Yes. Bring percentile and comp mix differences into your negotiation narrative, then validate with the offer and salary analyzers."
    },
    {
      question: "How often are comparison pages refreshed?",
      answer: "Comparison pages are refreshed as source salary benchmarks update in AvgPay&apos;s dataset."
    }
  ];

  const pageUrl = getFullUrl(`/compare/${comparisonSlug}`);

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <BreadcrumbSchema
          items={[
            { name: "Home", item: getBaseUrl() },
            { name: "Compare", item: getFullUrl("/compare") },
            { name: `${leftEntity.name} vs ${rightEntity.name}`, item: pageUrl },
          ]}
        />
        <FAQSchema items={faqs} />
        <WebPageSchema
          name={`${leftEntity.name} vs ${rightEntity.name} Salary Comparison`}
          description={`Detailed ${leftEntity.type} salary comparison between ${leftEntity.name} and ${rightEntity.name}.`}
          url={pageUrl}
        />

        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase text-emerald-700">{leftEntity.type} comparison</p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            {leftEntity.name} vs {rightEntity.name}
          </h1>
          <p className="text-lg text-slate-600">
            Compare compensation benchmarks across median outcomes, percentile spreads, and compensation mix.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Median delta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700">
              <p><strong>{leftEntity.name}</strong>: {formatCurrency(leftSummary.median)}</p>
              <p><strong>{rightEntity.name}</strong>: {formatCurrency(rightSummary.median)}</p>
              <p className="font-semibold text-slate-900">Delta: {deltaText(leftSummary.median, rightSummary.median)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Percentile deltas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700">
              <p>P25 delta: <strong>{deltaText(leftSummary.p25, rightSummary.p25)}</strong></p>
              <p>P75 delta: <strong>{deltaText(leftSummary.p75, rightSummary.p75)}</strong></p>
              <p>P90 delta: <strong>{deltaText(leftSummary.p90, rightSummary.p90)}</strong></p>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Comp mix differences</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 text-slate-700">
              <div>
                <h3 className="font-semibold text-slate-900">{leftEntity.name}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Base: {formatCurrency(leftSummary.mix.base)}</li>
                  <li>Bonus: {formatCurrency(leftSummary.mix.bonus)}</li>
                  <li>Equity: {formatCurrency(leftSummary.mix.equity)}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{rightEntity.name}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Base: {formatCurrency(rightSummary.mix.base)}</li>
                  <li>Bonus: {formatCurrency(rightSummary.mix.bonus)}</li>
                  <li>Equity: {formatCurrency(rightSummary.mix.equity)}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Who should pick what?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-700">
              <p>
                Pick <strong>{leftEntity.name}</strong> if you prioritize the stronger median and upper percentile trajectory for this comparison set.
              </p>
              <p>
                Pick <strong>{rightEntity.name}</strong> if you value its compensation mix profile and its fit with your risk tolerance or cash-flow needs.
              </p>
              <p>
                Validate both options by running your exact package through AvgPay&apos;s analyzers before making a final call.
              </p>
              <CompareConversionCTA compareSlug={comparisonSlug} />
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>FAQs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="text-slate-700">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Internal tools & resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-700">
              <ul className="list-disc space-y-1 pl-5">
                <li><Link className="text-emerald-700 hover:underline" href="/analyze-offer">Offer Analyzer</Link></li>
                <li><Link className="text-emerald-700 hover:underline" href="/analyze-salary">Salary Analyzer</Link></li>
                <li><Link className="text-emerald-700 hover:underline" href="/tools/compare-offers">Compare Offers Tool</Link></li>
                <li><Link className="text-emerald-700 hover:underline" href="/tools/percentile-calculator">Percentile Calculator</Link></li>
              </ul>
              <div className="rounded-xl border bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Get updates</h3>
                <p className="mb-3 text-sm text-slate-600">Get salary alerts for comparisons like this.</p>
                <EmailCapture type="salary-alerts" buttonText="Get salary alerts" source="comparison_page" />
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
