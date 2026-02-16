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
  const raw = await fs.readFile(metaPath, "utf8");
  return JSON.parse(raw);
}
