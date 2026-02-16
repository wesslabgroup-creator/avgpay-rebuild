import { renderPdf } from "../pdf/renderPdf";
import { writePurchaseFile } from "../storage";
import { createZipBuffer } from "../files/zip";
import { RenderContext } from "../types";
import { negotiationChecklistHtml, negotiationKitHtml } from "@/templates/pdf/htmlTemplates";

export async function generateNegotiationProduct(purchaseId: string, ctx: RenderContext, onProgress?: (progress: number, stage: string) => void) {
  onProgress?.(45, "Rendering negotiation kit PDF");
  const kitPdf = await renderPdf(negotiationKitHtml(ctx), "negotiation_kit");
  onProgress?.(60, "Rendering checklist PDF");
  const checklistPdf = await renderPdf(negotiationChecklistHtml(ctx), "negotiation_checklist");

  const txt = `Salary Negotiation Templates (${ctx.jobLabel}, ${ctx.cityLabel})\n\nAsk range: $${ctx.askLow} - $${ctx.askHigh}\nAnchor: $${ctx.anchor}\nWalk-away: $${ctx.walkAway}\n\nFriendly opener:\nThanks again for the offer. Based on market context and role scope, I'd like to discuss a package in the $${ctx.askLow}-$${ctx.askHigh} range.\n\nFirm:\nI'm ready to sign quickly if we can align at $${ctx.askHigh} total comp.\n\nDirect:\nIf we can move base/equity to meet $${ctx.askHigh}, I'm ready to close today.`;

  onProgress?.(72, "Writing kit files");
  const paths = {
    pdf: await writePurchaseFile(purchaseId, "negotiation_kit.pdf", kitPdf),
    checklist: await writePurchaseFile(purchaseId, "negotiation_checklist.pdf", checklistPdf),
    txt: await writePurchaseFile(purchaseId, "negotiation_templates.txt", txt),
  };

  onProgress?.(84, "Building ZIP bundle");
  const zip = createZipBuffer([
    { name: "negotiation_kit.pdf", data: kitPdf },
    { name: "negotiation_checklist.pdf", data: checklistPdf },
    { name: "negotiation_templates.txt", data: Buffer.from(txt) },
  ]);

  const bundle = await writePurchaseFile(purchaseId, "bundle.zip", zip);

  return [
    { label: "Negotiation Kit PDF", path: paths.pdf, kind: "pdf" as const },
    { label: "Negotiation Templates TXT", path: paths.txt, kind: "txt" as const },
    { label: "Negotiation Checklist PDF", path: paths.checklist, kind: "pdf" as const },
    { label: "Download All (ZIP)", path: bundle, kind: "zip" as const },
  ];
}
