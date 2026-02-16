import { renderPdf } from "../pdf/renderPdf";
import { writePurchaseFile } from "../storage";
import { createZipBuffer } from "../files/zip";
import { RenderContext } from "../types";
import { benchmarkHtml } from "@/templates/pdf/htmlTemplates";

export async function generateBenchmarkProduct(purchaseId: string, ctx: RenderContext) {
  const pdf = await renderPdf(benchmarkHtml(ctx), "benchmark_report");
  const csvRows = [
    "job,city,sample_size,p25,p50,p75,p90,estimated",
    `${ctx.jobLabel},${ctx.cityLabel},${ctx.stats.sampleSize},${ctx.stats.p25},${ctx.stats.p50},${ctx.stats.p75},${ctx.stats.p90},${ctx.stats.estimated}`,
  ];
  const csv = csvRows.join("\n");

  const pdfPath = await writePurchaseFile(purchaseId, "benchmark_report.pdf", pdf);
  const csvPath = await writePurchaseFile(purchaseId, "benchmark_data.csv", csv);

  const zip = createZipBuffer([
    { name: "benchmark_report.pdf", data: pdf },
    { name: "benchmark_data.csv", data: Buffer.from(csv) },
  ]);
  const bundlePath = await writePurchaseFile(purchaseId, "bundle.zip", zip);

  return [
    { label: "Benchmark Report PDF", path: pdfPath, kind: "pdf" as const },
    { label: "Benchmark Data CSV", path: csvPath, kind: "csv" as const },
    { label: "Download All (ZIP)", path: bundlePath, kind: "zip" as const },
  ];
}
