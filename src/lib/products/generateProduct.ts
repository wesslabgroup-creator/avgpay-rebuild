import { getCatalogProduct } from "./productCatalog";
import { PurchaseInput, PurchaseMeta } from "./meta";
import { computeAskRange, computeUnderpaidScore, getAdjacentRoles, getCityOptions, getJobOptions, getSalaryStats, getSkillPremiums } from "./stats";
import { writePurchaseFile } from "./storage";
import { generateNegotiationProduct } from "./generators/negotiation";
import { generateBenchmarkProduct } from "./generators/benchmark";
import { generateBlueprintProduct } from "./generators/blueprint";

type ProgressReporter = (progress: number, stage: string) => void;

export async function generateProduct(input: PurchaseInput, onProgress?: ProgressReporter) {
  const product = getCatalogProduct(input.productSlug);
  if (!product) throw new Error("Unknown product");

  const jobLabel = getJobOptions().find((job) => job.id === input.jobId)?.label ?? "Software Engineer";
  const cityLabel = getCityOptions().find((city) => city.id === input.cityId)?.label ?? "San Francisco, CA";

  onProgress?.(15, "Computing salary benchmarks");
  const stats = getSalaryStats(input.jobId, input.cityId);
  const ask = computeAskRange(stats, input.options);
  const underpaid = computeUnderpaidScore(stats, input.options);

  const ctx = {
    input,
    jobLabel,
    cityLabel,
    generatedDate: new Date().toLocaleDateString(),
    stats,
    askLow: ask.askLow,
    askHigh: ask.askHigh,
    anchor: ask.anchor,
    walkAway: ask.walkAway,
    underpaidScore: underpaid.score,
    underpaidTier: underpaid.tier,
    adjacentRoles: getAdjacentRoles(input.jobId),
    skillPremiums: getSkillPremiums(input.jobId),
  };

  onProgress?.(30, "Preparing personalized content");

  let files;
  if (input.productSlug === "salary-negotiation-kit") files = await generateNegotiationProduct(input.purchaseId, ctx, onProgress);
  else if (input.productSlug === "compensation-benchmark-report") files = await generateBenchmarkProduct(input.purchaseId, ctx, onProgress);
  else files = await generateBlueprintProduct(input.purchaseId, ctx, onProgress);

  const meta: PurchaseMeta = {
    purchaseId: input.purchaseId,
    productSlug: input.productSlug,
    productTitle: product.title,
    job: { id: input.jobId, label: jobLabel },
    city: { id: input.cityId, label: cityLabel },
    options: input.options,
    stats,
    computations: {
      askLow: ask.askLow,
      askHigh: ask.askHigh,
      anchor: ask.anchor,
      walkAway: ask.walkAway,
      underpaidScore: underpaid.score,
      underpaidTier: underpaid.tier,
    },
    files,
    createdAt: new Date().toISOString(),
  };

  onProgress?.(92, "Writing purchase metadata");
  const metaPath = await writePurchaseFile(input.purchaseId, "meta.json", JSON.stringify(meta, null, 2));

  onProgress?.(100, "Generation complete");

  return {
    purchaseId: input.purchaseId,
    files,
    deliveryUrl: `/delivery/${input.purchaseId}?token=demo`,
    metaPath,
  };
}
