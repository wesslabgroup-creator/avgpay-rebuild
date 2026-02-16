import { NextRequest, NextResponse } from "next/server";
import { getJobOptions } from "@/lib/products/stats";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  const results = getJobOptions()
    .filter((job) => job.label.toLowerCase().includes(query))
    .slice(0, 8);

  return NextResponse.json({ results });
}
