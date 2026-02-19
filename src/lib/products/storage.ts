import { promises as fs } from "fs";
import os from "os";
import path from "path";

const purchaseStorageRoot = process.env.PURCHASE_STORAGE_ROOT?.trim() || path.join(os.tmpdir(), "avgpay-generated-purchases");

export function getPurchaseDir(purchaseId: string) {
  return path.join(purchaseStorageRoot, purchaseId);
}

export function getPurchaseFilePath(purchaseId: string, fileName: string) {
  return path.join(getPurchaseDir(purchaseId), fileName);
}

export async function ensurePurchaseDir(purchaseId: string) {
  const dir = getPurchaseDir(purchaseId);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function writePurchaseFile(purchaseId: string, fileName: string, content: Buffer | string) {
  const dir = await ensurePurchaseDir(purchaseId);
  const fullPath = path.join(dir, fileName);
  await fs.writeFile(fullPath, content);
  return `/api/purchases/${purchaseId}/files/${encodeURIComponent(fileName)}`;
}

export async function readPurchaseMeta(purchaseId: string) {
  const metaPath = getPurchaseFilePath(purchaseId, "meta.json");
  try {
    const raw = await fs.readFile(metaPath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const dir = getPurchaseDir(purchaseId);
    const entries = await fs.readdir(dir).catch(() => [] as string[]);
    const fileNames = entries.filter((entry) => entry !== "meta.json");

    if (fileNames.length === 0) {
      throw error;
    }

    const files = fileNames.map((fileName) => ({
      label: fileName,
      path: `/api/purchases/${purchaseId}/files/${encodeURIComponent(fileName)}`,
    }));

    const stats = await Promise.all(
      fileNames.map(async (fileName) => fs.stat(getPurchaseFilePath(purchaseId, fileName)).catch(() => null))
    );
    const createdAt = stats.reduce<string>((latest, stat) => {
      if (!stat) {
        return latest;
      }

      const candidate = stat.mtime.toISOString();
      return candidate > latest ? candidate : latest;
    }, new Date(0).toISOString());

    return {
      purchaseId,
      productSlug: "generated-purchase",
      productTitle: "Your generated files",
      job: { id: "unknown", label: "Personalized purchase" },
      city: { id: "unknown", label: "Generated delivery" },
      options: {},
      stats: {},
      computations: {},
      files,
      createdAt,
    };
  }
}
