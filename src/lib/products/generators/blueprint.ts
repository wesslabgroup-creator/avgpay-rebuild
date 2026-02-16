import { renderPdf } from "../pdf/renderPdf";
import { writePurchaseFile } from "../storage";
import { createZipBuffer } from "../files/zip";
import { RenderContext } from "../types";
import { blueprintHtml } from "@/templates/pdf/htmlTemplates";

export async function generateBlueprintProduct(purchaseId: string, ctx: RenderContext, onProgress?: (progress: number, stage: string) => void) {
  onProgress?.(45, "Rendering blueprint PDF");
  const pdf = await renderPdf(blueprintHtml(ctx), "career_blueprint");
  const csv = [
    "Week/Month,Goal,Skill,Proof-of-work,Time estimate,Notes",
    `Month 1,Define target role,${ctx.skillPremiums[0]?.skill ?? "System design"},Role gap memo,4h,Sample/Illustrative`,
    `Month 2,Ship high-impact project,${ctx.skillPremiums[1]?.skill ?? "Execution"},Launch summary,8h,Sample/Illustrative`,
    `Month 3,Build negotiation packet,Communication,Impact deck,5h,Sample/Illustrative`,
    `Month 6,Promotion calibration,Leadership,Manager plan,3h,Sample/Illustrative`,
    `Month 12,Execute offer strategy,Negotiation,Decision matrix,6h,Sample/Illustrative`,
  ].join("\n");

  onProgress?.(72, "Writing blueprint files");
  const pdfPath = await writePurchaseFile(purchaseId, "career_blueprint.pdf", pdf);
  const csvPath = await writePurchaseFile(purchaseId, "career_roadmap.csv", csv);

  onProgress?.(84, "Building ZIP bundle");
  const zip = createZipBuffer([
    { name: "career_blueprint.pdf", data: pdf },
    { name: "career_roadmap.csv", data: Buffer.from(csv) },
  ]);
  const bundlePath = await writePurchaseFile(purchaseId, "bundle.zip", zip);

  return [
    { label: "Career Blueprint PDF", path: pdfPath, kind: "pdf" as const },
    { label: "Career Roadmap CSV", path: csvPath, kind: "csv" as const },
    { label: "Download All (ZIP)", path: bundlePath, kind: "zip" as const },
  ];
}
