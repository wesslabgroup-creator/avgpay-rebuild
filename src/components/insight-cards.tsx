"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Scale,
  Heart,
  GraduationCap,
  DollarSign,
  Factory,
  Home,
  TrendingUp,
  Zap,
  Shield,
  Lightbulb,
  type LucideIcon,
} from 'lucide-react';

// ============================================================
// Key-to-display mapping
// ============================================================

interface InsightMeta {
  title: string;
  icon: LucideIcon;
  color: string; // Tailwind text color class
  bgColor: string; // Tailwind bg color class for icon container
}

const INSIGHT_KEY_MAP: Record<string, InsightMeta> = {
  // Company keys
  comp_philosophy: {
    title: 'Compensation Structure',
    icon: Scale,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  benefit_sentiment: {
    title: 'Benefits & Culture',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
  },
  hiring_bar: {
    title: 'Interview Difficulty',
    icon: GraduationCap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },

  // City keys
  buying_power: {
    title: 'Real Wage Analysis',
    icon: DollarSign,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  market_drivers: {
    title: 'Market Drivers',
    icon: Factory,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  lifestyle_economics: {
    title: 'Lifestyle Economics',
    icon: Home,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },

  // Job keys
  career_leverage: {
    title: 'Career Leverage',
    icon: TrendingUp,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  skill_premium: {
    title: 'Skill Premium',
    icon: Zap,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  remote_viability: {
    title: 'Remote Viability',
    icon: Shield,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
  },
};

// Fallback for dynamic schema expansion keys
function getInsightMeta(key: string): InsightMeta {
  if (INSIGHT_KEY_MAP[key]) {
    return INSIGHT_KEY_MAP[key];
  }

  // Generate a reasonable title from the key
  const title = key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  return {
    title,
    icon: Lightbulb,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
  };
}

// ============================================================
// Components
// ============================================================

interface InsightCardsProps {
  analysis: Record<string, string>;
  entityName: string;
}

export function InsightCards({ analysis, entityName }: InsightCardsProps) {
  const entries = Object.entries(analysis).filter(
    ([, value]) => typeof value === 'string' && value.length > 0
  );

  if (entries.length === 0) return null;

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">Insights</CardTitle>
            <p className="text-sm text-slate-500 mt-0.5">
              Dynamic, data-backed insights for {entityName}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(([key, value]) => {
            const meta = getInsightMeta(key);
            const Icon = meta.icon;

            return (
              <div
                key={key}
                className="rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`h-9 w-9 rounded-lg ${meta.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-4.5 w-4.5 ${meta.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {meta.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton loader shown while analysis is being generated.
 */
export function InsightCardsSkeleton() {
  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-52 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-slate-200 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-4/6 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
