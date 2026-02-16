import { promises as fs } from "fs";
import path from "path";

export function getPurchaseDir(purchaseId: string) {
  return path.join(process.cwd(), "public", "generated", "purchases", purchaseId);
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
  return `/generated/purchases/${purchaseId}/${fileName}`;
}

export async function readPurchaseMeta(purchaseId: string) {
  const metaPath = path.join(getPurchaseDir(purchaseId), "meta.json");
  const raw = await fs.readFile(metaPath, "utf8");
  return JSON.parse(raw);
}
