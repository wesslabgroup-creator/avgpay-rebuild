import { NextRequest, NextResponse } from "next/server";
import { getCityOptions } from "@/lib/products/stats";

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").toLowerCase();
  const results = getCityOptions()
    .filter((city) => city.label.toLowerCase().includes(query))
    .slice(0, 8);

  return NextResponse.json({ results });
}
