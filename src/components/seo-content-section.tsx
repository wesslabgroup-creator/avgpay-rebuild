"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { EntityType } from '@/lib/seoContentGenerator';

interface SEOContentSectionProps {
  entityType: EntityType;
  entityName: string;
  contextData: string;
}

const KEY_LABELS: Record<string, { label: string; icon: string }> = {
  // Company keys
  comp_philosophy: { label: 'Compensation Philosophy', icon: '💰' },
  benefit_sentiment: { label: 'Benefits & Perks', icon: '🎯' },
  hiring_bar: { label: 'Hiring & Interview Process', icon: '📋' },
  // City keys
  buying_power: { label: 'Buying Power & Take-Home Pay', icon: '🏦' },
  market_drivers: { label: 'Market & Industry Drivers', icon: '📊' },
  lifestyle_economics: { label: 'Lifestyle & Cost Economics', icon: '🏠' },
  // Job keys
  career_leverage: { label: 'Career Leverage & Growth', icon: '📈' },
  skill_premium: { label: 'Skill Premium & Certifications', icon: '🎓' },
  remote_viability: { label: 'Remote Work Viability', icon: '🌐' },
};

const SECTION_TITLES: Record<EntityType, string> = {
  Company: 'Compensation & Culture Analysis',
  City: 'Financial Context & Cost of Living',
  Job: 'Career & Compensation Analysis',
};

function getKeyLabel(key: string): string {
  return KEY_LABELS[key]?.label || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function SkeletonBlock() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-full"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
  );
}

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
        // Content will remain null — section simply won't render detailed content
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [entityType, entityName, contextData]);

  const sectionTitle = SECTION_TITLES[entityType];

  if (!isLoading && !content) return null;

  const entries = content ? Object.entries(content) : [];

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">{sectionTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(i => (
              <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <div className="h-5 bg-slate-200 rounded w-1/2 mb-4 animate-pulse"></div>
                <SkeletonBlock />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entries.map(([key, value]) => (
              <div key={key} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                  {getKeyLabel(key)}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
