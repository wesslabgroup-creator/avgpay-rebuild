export const dynamic = "force-dynamic";
export const revalidate = 0;

import { promises as fs } from "fs";
import path from "path";
import { getPurchaseFilePath } from "@/lib/products/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".csv": "text/csv; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".zip": "application/zip",
  ".json": "application/json; charset=utf-8",
};

function sanitizeFileName(fileName: string) {
  const decoded = decodeURIComponent(fileName);
  return path.basename(decoded);
}

export async function GET(_: Request, { params }: { params: { purchaseId: string; fileName: string } }) {
  const safeFileName = sanitizeFileName(params.fileName);
  const filePath = getPurchaseFilePath(params.purchaseId, safeFileName);

  try {
    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(safeFileName).toLowerCase();

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return Response.json({ error: "File not found" }, { status: 404 });
  }
}
