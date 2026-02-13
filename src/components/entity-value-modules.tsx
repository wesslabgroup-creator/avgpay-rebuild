"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  TrendingUp,
  Shield,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  MapPin,
} from 'lucide-react';

// ============================================================
// Percentile Bands Module
// ============================================================

interface PercentileBandsProps {
  percentiles: { p10?: number; p25: number; p50: number; p75: number; p90?: number };
  entityName: string;
  submissionCount: number;
}

const fmt = (n: number) => `$${Math.round(n / 1000)}k`;

export function PercentileBands({ percentiles, entityName, submissionCount }: PercentileBandsProps) {
  if (submissionCount < 5) return null;

  const bands = [
    { label: '90th', value: percentiles.p90, color: 'bg-emerald-600' },
    { label: '75th', value: percentiles.p75, color: 'bg-emerald-500' },
    { label: 'Median', value: percentiles.p50, color: 'bg-emerald-400' },
    { label: '25th', value: percentiles.p25, color: 'bg-emerald-300' },
    { label: '10th', value: percentiles.p10, color: 'bg-emerald-200' },
  ].filter((b) => b.value !== undefined && b.value > 0) as { label: string; value: number; color: string }[];

  const maxVal = Math.max(...bands.map((b) => b.value));

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Salary Percentile Bands
        </CardTitle>
        <p className="text-sm text-slate-500">
          Where you fall in the {entityName} compensation distribution ({submissionCount.toLocaleString()} data points)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bands.map((band) => (
            <div key={band.label} className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 w-16 text-right">{band.label}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className={`${band.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${(band.value / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-16">{fmt(band.value)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Percentiles show the percentage of reported salaries below each threshold. The median (50th) is the midpoint.
        </p>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Compensation Mix Breakdown
// ============================================================

interface CompMixProps {
  compMix: { avgBasePct: number; avgEquityPct: number; avgBonusPct: number };
  entityName: string;
}

export function CompMixBreakdown({ compMix, entityName }: CompMixProps) {
  const { avgBasePct, avgEquityPct, avgBonusPct } = compMix;
  if (avgBasePct === 0 && avgEquityPct === 0 && avgBonusPct === 0) return null;

  const segments = [
    { label: 'Base Salary', pct: avgBasePct, color: 'bg-blue-500' },
    { label: 'Equity / RSUs', pct: avgEquityPct, color: 'bg-emerald-500' },
    { label: 'Bonus', pct: avgBonusPct, color: 'bg-amber-500' },
  ];

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-emerald-600" />
          Compensation Mix
        </CardTitle>
        <p className="text-sm text-slate-500">
          Average base / equity / bonus split for {entityName}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex h-8 rounded-full overflow-hidden mb-4">
          {segments.map((seg) => (
            seg.pct > 0 && (
              <div
                key={seg.label}
                className={`${seg.color} transition-all duration-500`}
                style={{ width: `${seg.pct}%` }}
                title={`${seg.label}: ${seg.pct.toFixed(1)}%`}
              />
            )
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${seg.color}`} />
              <span className="text-sm text-slate-600">{seg.label}: {seg.pct.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// YoE Progression Ladder
// ============================================================

interface YoeProgressionProps {
  yoeProgression: { yoeRange: string; medianComp: number; count: number }[];
  entityName: string;
}

export function YoeProgression({ yoeProgression, entityName }: YoeProgressionProps) {
  if (!yoeProgression || yoeProgression.length < 2) return null;

  const maxComp = Math.max(...yoeProgression.map((y) => y.medianComp));

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Career Progression
        </CardTitle>
        <p className="text-sm text-slate-500">
          How {entityName} compensation scales with years of experience
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {yoeProgression.map((bucket) => (
            <div key={bucket.yoeRange} className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600 w-20 text-right">{bucket.yoeRange} yrs</span>
              <div className="flex-1 bg-slate-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(bucket.medianComp / maxComp) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-slate-900 w-16">{fmt(bucket.medianComp)}</span>
              <span className="text-xs text-slate-400 w-12">n={bucket.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Data Confidence Indicator
// ============================================================

interface DataConfidenceProps {
  confidence: {
    submissionCount: number;
    confidenceLabel: string;
    diversityScore?: number;
    roleCount?: number;
    cityCount?: number;
    companyCount?: number;
  };
  entityName: string;
}

export function DataConfidence({ confidence, entityName }: DataConfidenceProps) {
  const colorMap: Record<string, string> = {
    high: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    moderate: 'text-blue-600 bg-blue-50 border-blue-200',
    limited: 'text-amber-600 bg-amber-50 border-amber-200',
    insufficient: 'text-red-600 bg-red-50 border-red-200',
  };
  const colorClass = colorMap[confidence.confidenceLabel] || colorMap.limited;

  return (
    <div className={`rounded-lg border p-4 ${colorClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4" />
        <span className="text-sm font-semibold capitalize">Data Confidence: {confidence.confidenceLabel}</span>
      </div>
      <p className="text-xs">
        This {entityName} profile is built from {confidence.submissionCount.toLocaleString()} salary submissions
        {confidence.roleCount ? ` across ${confidence.roleCount} roles` : ''}
        {confidence.companyCount ? ` and ${confidence.companyCount} companies` : ''}
        {confidence.cityCount ? ` in ${confidence.cityCount} cities` : ''}.
        {confidence.confidenceLabel === 'insufficient' && ' More submissions are needed for reliable estimates.'}
        {confidence.confidenceLabel === 'limited' && ' Estimates improve with additional submissions.'}
        {confidence.confidenceLabel === 'high' && ' This dataset provides reliable compensation benchmarks.'}
      </p>
    </div>
  );
}

// ============================================================
// FAQ Section (Expandable, SSR-friendly)
// ============================================================

interface FAQSectionProps {
  faqs: { question: string; answer: string }[];
  entityName: string;
}

export function FAQSection({ faqs, entityName }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          Frequently Asked Questions: {entityName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-slate-100">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-3">
      <button
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-800 hover:text-emerald-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 ml-2" /> : <ChevronDown className="h-4 w-4 shrink-0 ml-2" />}
      </button>
      {isOpen && (
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

// ============================================================
// External Links Section
// ============================================================

interface ExternalLinksSectionProps {
  links: { href: string; label: string; source: string; description: string }[];
}

export function ExternalLinksSection({ links }: ExternalLinksSectionProps) {
  if (!links || links.length === 0) return null;

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-slate-600" />
          Other Sources
        </CardTitle>
        <p className="text-sm text-slate-500">
          Verified external resources for additional compensation research
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium hover:underline"
              >
                {link.label}
              </a>
              <span className="text-xs text-slate-400 ml-2">({link.source})</span>
              <p className="text-xs text-slate-500 mt-0.5">{link.description}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// ============================================================
// Data Disclaimer
// ============================================================

export function DataDisclaimer() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <p className="text-xs text-slate-500 leading-relaxed">
          <strong>Data Methodology:</strong> Compensation data on AvgPay is aggregated from self-reported submissions,
          public H-1B visa filings, BLS occupational data, and pay transparency disclosures. All figures represent total
          compensation (base + equity + bonus). Individual outcomes vary by level, location, negotiation, and company stage.
          This data is not verified by employers. Use percentile ranges rather than single-point estimates for
          decision-making. See our <Link href="/methodology" className="text-emerald-600 hover:underline">methodology</Link> for details.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Nearby/Related Cities Section
// ============================================================

interface RelatedCitiesProps {
  nearbyCities: { href: string; label: string; context: string }[];
  cityName: string;
}

export function RelatedCities({ nearbyCities, cityName }: RelatedCitiesProps) {
  if (!nearbyCities || nearbyCities.length === 0) return null;

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Compare {cityName} to Nearby Markets
        </CardTitle>
        <p className="text-sm text-slate-500">
          Similar or nearby tech salary markets for relocation comparison
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {nearbyCities.map((city) => (
            <Link
              key={city.href}
              href={city.href}
              className="rounded-lg border border-slate-200 p-3 hover:border-emerald-300 hover:bg-slate-50 transition-colors text-center"
            >
              <p className="font-medium text-sm text-emerald-600 hover:text-emerald-700">{city.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">Salary data</p>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
