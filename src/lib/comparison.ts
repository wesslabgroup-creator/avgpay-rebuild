import { COMPANIES, LOCATIONS, MARKET_DATA, MarketData, ROLES } from "@/lib/data";

export type CompareEntityType = "company" | "role" | "location";

export interface CompareEntity {
  name: string;
  slug: string;
  type: CompareEntityType;
}

export interface ComparisonSummary {
  median: number;
  p25: number;
  p75: number;
  p90: number;
  mix: {
    base: number;
    bonus: number;
    equity: number;
  };
}

export function slugifyEntityName(value: string): string {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildEntityIndex(values: string[], type: CompareEntityType): Map<string, CompareEntity> {
  return new Map(values.map((name) => {
    const slug = slugifyEntityName(name);
    return [slug, { name, slug, type } as CompareEntity];
  }));
}

const companyIndex = buildEntityIndex(COMPANIES, "company");
const roleIndex = buildEntityIndex(ROLES, "role");
const locationIndex = buildEntityIndex(LOCATIONS, "location");

export function resolveCompareEntity(slug: string): CompareEntity | null {
  return companyIndex.get(slug) ?? roleIndex.get(slug) ?? locationIndex.get(slug) ?? null;
}

export function getEntityValuesByType(type: CompareEntityType): string[] {
  if (type === "company") return COMPANIES;
  if (type === "role") return ROLES;
  return LOCATIONS;
}

function hashValue(text: string): number {
  return Array.from(text).reduce((acc, char) => acc + char.charCodeAt(0), 0);
}

function buildCompMix(entityName: string, median: number): ComparisonSummary["mix"] {
  const hash = hashValue(entityName);
  const basePct = 0.62 + (hash % 8) / 100;
  const bonusPct = 0.08 + (hash % 4) / 100;
  const equityPct = Math.max(0.12, 1 - basePct - bonusPct);

  return {
    base: Math.round(median * basePct),
    bonus: Math.round(median * bonusPct),
    equity: Math.round(median * equityPct),
  };
}

function collectRecordsForEntity(entity: CompareEntity): MarketData[] {
  const records: MarketData[] = [];

  for (const [company, roles] of Object.entries(MARKET_DATA)) {
    for (const [role, locations] of Object.entries(roles)) {
      for (const [location, levels] of Object.entries(locations)) {
        const levelData = levels["Mid (L3-L4)"] ?? Object.values(levels)[0];
        if (!levelData) continue;

        const matches =
          (entity.type === "company" && company === entity.name) ||
          (entity.type === "role" && role === entity.name) ||
          (entity.type === "location" && location === entity.name);

        if (matches) {
          records.push(levelData);
        }
      }
    }
  }

  return records;
}

export function buildComparisonSummary(entity: CompareEntity): ComparisonSummary {
  const records = collectRecordsForEntity(entity);

  if (records.length === 0) {
    const fallbackMedian = 180000;
    return {
      median: fallbackMedian,
      p25: Math.round(fallbackMedian * 0.9),
      p75: Math.round(fallbackMedian * 1.1),
      p90: Math.round(fallbackMedian * 1.2),
      mix: buildCompMix(entity.name, fallbackMedian),
    };
  }

  const average = (values: number[]) => Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);

  const median = average(records.map((record) => record.median));
  const p25 = average(records.map((record) => record.p25));
  const p75 = average(records.map((record) => record.p75));
  const p90 = average(records.map((record) => record.p90));

  return {
    median,
    p25,
    p75,
    p90,
    mix: buildCompMix(entity.name, median),
  };
}
