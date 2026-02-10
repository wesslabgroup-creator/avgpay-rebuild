"use client";

import { useState, useEffect } from 'react';
import type { EntityType } from '@/lib/seoContentGenerator';

interface SEOContentSectionProps {
  entityType: EntityType;
  entityName: string;
  contextData: string;
}

// ── Key metadata: labels, descriptions, and layout hints ────────────────────

interface KeyMeta {
  label: string;
  subtitle: string;
  featured?: boolean;
}

const KEY_META: Record<string, KeyMeta> = {
  // Company
  comp_philosophy:      { label: 'Compensation Philosophy', subtitle: 'How total pay is structured', featured: true },
  equity_structure:     { label: 'Equity & Vesting', subtitle: 'Stock, RSUs, and long-term incentives' },
  benefit_sentiment:    { label: 'Benefits & Perks', subtitle: 'Non-cash compensation value' },
  hiring_bar:           { label: 'Hiring Process', subtitle: 'Interview structure and expectations' },
  negotiation_leverage: { label: 'Negotiation Leverage', subtitle: 'Where candidates have room to push' },
  career_trajectory:    { label: 'Career Trajectory', subtitle: 'Promotion paths and internal growth' },
  work_culture_impact:  { label: 'Work Culture & Effective Rate', subtitle: 'How pace affects real compensation' },

  // City
  buying_power:               { label: 'Buying Power', subtitle: 'What your salary actually buys here', featured: true },
  tax_landscape:              { label: 'Tax Landscape', subtitle: 'State, local, and property tax impact' },
  market_drivers:             { label: 'Market Drivers', subtitle: 'Industries shaping the salary floor' },
  housing_affordability:      { label: 'Housing Affordability', subtitle: 'Rent and mortgage relative to income' },
  lifestyle_economics:        { label: 'Lifestyle Costs', subtitle: 'The hidden expenses of daily life' },
  commute_and_infrastructure: { label: 'Commute & Infrastructure', subtitle: 'Transportation costs and time' },
  relocation_considerations:  { label: 'Relocation Considerations', subtitle: 'Financial impact of moving here' },

  // Job
  career_leverage:    { label: 'Career Leverage', subtitle: 'How seniority multiplies compensation', featured: true },
  skill_premium:      { label: 'Skill Premium', subtitle: 'Specializations that command top-quartile pay' },
  total_comp_anatomy: { label: 'Total Comp Anatomy', subtitle: 'Base, bonus, and equity breakdown' },
  negotiation_tips:   { label: 'Negotiation Strategy', subtitle: 'Role-specific tactics for maximizing offers' },
  remote_viability:   { label: 'Remote Work Viability', subtitle: 'Location flexibility and pay adjustments' },
  adjacent_roles:     { label: 'Adjacent Roles', subtitle: 'Lateral moves that increase earning power' },
  demand_resilience:  { label: 'Demand Resilience', subtitle: 'Automation risk and structural demand' },
};

const SECTION_TITLES: Record<EntityType, { heading: string; subheading: string }> = {
  Company: {
    heading: 'Compensation & Employer Analysis',
    subheading: 'Expert analysis of pay structure, benefits, negotiation leverage, and career growth',
  },
  City: {
    heading: 'Financial Context & Cost of Living',
    subheading: 'Tax impact, housing costs, market dynamics, and what your salary actually buys',
  },
  Job: {
    heading: 'Career & Compensation Intelligence',
    subheading: 'Career ladder mechanics, negotiation strategy, and structural demand analysis',
  },
};

function getKeyMeta(key: string): KeyMeta {
  return KEY_META[key] || {
    label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    subtitle: 'Additional insight',
  };
}

// ── Skeleton loaders ────────────────────────────────────────────────────────

function FeaturedSkeleton() {
  return (
    <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 animate-pulse">
      <div className="h-6 bg-emerald-200/50 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-emerald-200/30 rounded w-1/4 mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-emerald-200/40 rounded w-full"></div>
        <div className="h-4 bg-emerald-200/40 rounded w-11/12"></div>
        <div className="h-4 bg-emerald-200/40 rounded w-10/12"></div>
        <div className="h-4 bg-emerald-200/40 rounded w-full"></div>
        <div className="h-4 bg-emerald-200/40 rounded w-9/12"></div>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="p-5 rounded-lg border border-slate-200 bg-white animate-pulse">
      <div className="h-5 bg-slate-200 rounded w-2/3 mb-2"></div>
      <div className="h-3 bg-slate-100 rounded w-1/2 mb-4"></div>
      <div className="space-y-2.5">
        <div className="h-3.5 bg-slate-100 rounded w-full"></div>
        <div className="h-3.5 bg-slate-100 rounded w-11/12"></div>
        <div className="h-3.5 bg-slate-100 rounded w-10/12"></div>
        <div className="h-3.5 bg-slate-100 rounded w-full"></div>
      </div>
    </div>
  );
}

// ── Identify dynamic (bonus) keys ───────────────────────────────────────────

const STANDARD_KEYS = new Set([
  'comp_philosophy', 'equity_structure', 'benefit_sentiment', 'hiring_bar',
  'negotiation_leverage', 'career_trajectory', 'work_culture_impact',
  'buying_power', 'tax_landscape', 'market_drivers', 'housing_affordability',
  'lifestyle_economics', 'commute_and_infrastructure', 'relocation_considerations',
  'career_leverage', 'skill_premium', 'total_comp_anatomy', 'negotiation_tips',
  'remote_viability', 'adjacent_roles', 'demand_resilience',
]);

function isDynamicKey(key: string): boolean {
  return !STANDARD_KEYS.has(key);
}

// ── Main component ──────────────────────────────────────────────────────────

export function SEOContentSection({ entityType, entityName, contextData }: SEOContentSectionProps) {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/seo-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entityType, entityName, contextData }),
        });

        if (!response.ok) throw new Error('Failed to fetch SEO content');

        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        console.error('SEO content fetch error:', err);
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [entityType, entityName, contextData]);

  if (!isLoading && !content) return null;

  const section = SECTION_TITLES[entityType];
  const entries = content ? Object.entries(content) : [];

  // Separate featured, standard, and dynamic entries
  const featured = entries.find(([key]) => getKeyMeta(key).featured);
  const standard = entries.filter(([key]) => !getKeyMeta(key).featured && !isDynamicKey(key));
  const dynamic = entries.filter(([key]) => isDynamicKey(key));

  return (
    <section className="space-y-6">
      {/* Section header */}
      <div className="border-l-4 border-emerald-500 pl-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {section.heading}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{section.subheading}</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <FeaturedSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[0, 1, 2, 3, 4, 5].map(i => <CardSkeleton key={i} />)}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured insight — full width, visually prominent */}
          {featured && (
            <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60">
              <h3 className="text-lg font-semibold text-emerald-900">
                {getKeyMeta(featured[0]).label}
              </h3>
              <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mt-0.5 mb-4">
                {getKeyMeta(featured[0]).subtitle}
              </p>
              <p className="text-base text-slate-800 leading-relaxed">
                {featured[1]}
              </p>
            </div>
          )}

          {/* Standard sections — 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {standard.map(([key, value]) => {
              const meta = getKeyMeta(key);
              return (
                <article key={key} className="p-5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <h3 className="text-base font-semibold text-slate-900">{meta.label}</h3>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-0.5 mb-3">
                    {meta.subtitle}
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
                </article>
              );
            })}
          </div>

          {/* Dynamic keys — amber callout boxes for entity-specific insights */}
          {dynamic.length > 0 && (
            <div className="space-y-4">
              {dynamic.map(([key, value]) => {
                const meta = getKeyMeta(key);
                return (
                  <div key={key} className="p-5 rounded-lg bg-amber-50 border border-amber-200/60">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 text-xs font-bold">!</span>
                      <div>
                        <h3 className="text-base font-semibold text-amber-900">{meta.label}</h3>
                        <p className="text-sm text-amber-800 leading-relaxed mt-1">{value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
