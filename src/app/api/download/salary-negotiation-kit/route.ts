import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createZipBuffer } from "@/lib/zip";

export async function GET() {
  const baseDir = path.join(process.cwd(), "public", "products", "salary-negotiation-kit");

  const files = [
    {
      source: "salary-negotiation-kit.pdf",
      name: "salary-negotiation-kit.pdf",
    },
    {
      source: "negotiation-checklist.pdf",
      name: "negotiation-checklist.pdf",
    },
    {
      source: "negotiation-templates.txt",
      name: "negotiation-templates.txt",
    },
  ];

  const entries = await Promise.all(
    files.map(async (file) => ({
      name: file.name,
      data: await fs.readFile(path.join(baseDir, file.source)),
    }))
  );

  const zip = createZipBuffer(entries);

  return new NextResponse(new Uint8Array(zip), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="avgpay-salary-negotiation-kit.zip"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
