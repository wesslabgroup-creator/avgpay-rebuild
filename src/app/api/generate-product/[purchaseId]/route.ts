export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getGenerationState } from "@/lib/products/progress";
import { readPurchaseMeta } from "@/lib/products/storage";

export async function GET(_: Request, { params }: { params: { purchaseId: string } }) {
  const state = getGenerationState(params.purchaseId);

  if (state) {
    return NextResponse.json(state);
  }

  try {
    await readPurchaseMeta(params.purchaseId);
    return NextResponse.json({
      purchaseId: params.purchaseId,
      status: "completed",
      progress: 100,
      stage: "Files ready",
      updatedAt: Date.now(),
      deliveryUrl: `/delivery/${params.purchaseId}?token=demo`,
    });
  } catch {
    return NextResponse.json({
      purchaseId: params.purchaseId,
      status: "queued",
      progress: 0,
      stage: "Waiting to start",
      updatedAt: Date.now(),
      deliveryUrl: `/delivery/${params.purchaseId}?token=demo`,
    });
  }
}
