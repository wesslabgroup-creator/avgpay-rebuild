import { LOCATIONS, MARKET_DATA, ROLES } from "@/lib/shared-data";
import adjacentRolesData from "@/data/adjacent_roles.json";
import skillPremiumsData from "@/data/skill_premiums.json";
import { PurchaseOptions, SalaryStats } from "./meta";

type SkillPremium = { skill: string; premium: number };

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function parseCity(cityId: string) {
  return cityId.split("--").join(", ");
}

export function getJobOptions() {
  return ROLES.map((role) => ({ id: role.toLowerCase().replaceAll(" ", "-"), label: role }));
}

export function getCityOptions() {
  return LOCATIONS.map((location) => ({ id: location.toLowerCase().replaceAll(", ", "--"), label: location }));
}

export function getSalaryStats(jobId: string, cityId: string): SalaryStats {
  const jobLabel = getJobOptions().find((job) => job.id === jobId)?.label ?? "Software Engineer";
  const cityLabel = getCityOptions().find((city) => city.id === cityId)?.label ?? parseCity(cityId);

  const salaries: number[] = [];

  Object.values(MARKET_DATA).forEach((company) => {
    const roleData = company[jobLabel];
    const cityData = roleData?.[cityLabel];
    if (!cityData) return;
    Object.values(cityData).forEach((level) => {
      salaries.push(level.median);
    });
  });

  let estimated = false;
  let values = salaries;
  let estimateNote = "";

  if (values.length < 25) {
    estimated = true;
    estimateNote = "Estimated (limited local sample). Fallback model blended across national sample.";

    const national: number[] = [];
    Object.values(MARKET_DATA).forEach((company) => {
      const roleData = company[jobLabel];
      if (!roleData) return;
      Object.values(roleData).forEach((byLevel) => {
        Object.values(byLevel).forEach((level) => national.push(level.median));
      });
    });
    values = national.length ? national : [150000, 180000, 210000, 240000, 270000, 310000];
  }

  const sampleSize = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

  return {
    sampleSize,
    min,
    max,
    mean,
    p25: percentile(values, 25),
    p50: percentile(values, 50),
    p75: percentile(values, 75),
    p90: percentile(values, 90),
    estimated,
    estimateNote,
  };
}

export function computeAskRange(stats: SalaryStats, options: PurchaseOptions) {
  const target = options.targetSalary ?? stats.p75;
  const askLow = Math.max(stats.p50, Math.round(target * 0.95));
  const askHigh = Math.max(askLow + 5000, Math.round(Math.min(stats.p90, target * 1.15)));
  const anchor = Math.round(askHigh * 1.03);
  const walkAway = Math.round(askLow * 0.93);

  return { askLow, askHigh, anchor, walkAway };
}

export function computeUnderpaidScore(stats: SalaryStats, options: PurchaseOptions) {
  const current = options.currentSalary ?? options.offerAmount ?? stats.p50;
  const gap = ((stats.p75 - current) / stats.p75) * 100;
  const score = Math.max(0, Math.min(100, Math.round(gap + (options.yearsExperience && options.yearsExperience > 6 ? 8 : 0))));

  let tier = "Fairly Paid";
  if (score > 80) tier = "Severely Underpaid";
  else if (score > 60) tier = "Likely Underpaid";
  else if (score > 30) tier = "Possibly Underpaid";

  return { score, tier };
}

export function getAdjacentRoles(jobId: string) {
  const jobLabel = getJobOptions().find((job) => job.id === jobId)?.label ?? "Software Engineer";
  const data = adjacentRolesData as Record<string, string[]>;
  return data[jobLabel] ?? data["Software Engineer"];
}

export function getSkillPremiums(jobId: string): SkillPremium[] {
  const jobLabel = getJobOptions().find((job) => job.id === jobId)?.label ?? "Software Engineer";
  const data = skillPremiumsData as Record<string, SkillPremium[]>;
  return data[jobLabel] ?? data["Software Engineer"];
}
