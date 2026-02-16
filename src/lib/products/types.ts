import { PurchaseInput, SalaryStats } from "./meta";

export type RenderContext = {
  input: PurchaseInput;
  jobLabel: string;
  cityLabel: string;
  generatedDate: string;
  stats: SalaryStats;
  askLow: number;
  askHigh: number;
  anchor: number;
  walkAway: number;
  underpaidScore: number;
  underpaidTier: string;
  adjacentRoles: string[];
  skillPremiums: { skill: string; premium: number }[];
};
