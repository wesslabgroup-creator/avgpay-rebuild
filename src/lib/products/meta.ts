import { ProductSlug } from "./productCatalog";

export type PurchaseOptions = {
  yearsExperience?: number;
  industry?: string;
  company?: string;
  remotePreference?: "remote" | "hybrid" | "onsite";
  currentSalary?: number;
  targetSalary?: number;
  hasOffer?: "yes" | "no";
  offerAmount?: number;
  level?: string;
  targetRole?: string;
  timeline?: "3" | "6" | "12";
};

export type PurchaseInput = {
  purchaseId: string;
  productSlug: ProductSlug;
  jobId: string;
  cityId: string;
  options: PurchaseOptions;
};

export type SalaryStats = {
  sampleSize: number;
  min: number;
  max: number;
  mean: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  estimated: boolean;
  estimateNote?: string;
};

export type GeneratedFile = {
  label: string;
  path: string;
  kind: "pdf" | "csv" | "txt" | "zip";
};

export type PurchaseMeta = {
  purchaseId: string;
  productSlug: ProductSlug;
  productTitle: string;
  job: { id: string; label: string };
  city: { id: string; label: string };
  options: PurchaseOptions;
  stats: SalaryStats;
  computations: {
    askLow: number;
    askHigh: number;
    anchor: number;
    walkAway: number;
    underpaidScore: number;
    underpaidTier: string;
  };
  files: GeneratedFile[];
  createdAt: string;
};
