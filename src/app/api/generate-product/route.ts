import { NextRequest, NextResponse } from "next/server";
import { generateProduct } from "@/lib/products/generateProduct";
import { PurchaseInput } from "@/lib/products/meta";
import { getCatalogProduct } from "@/lib/products/productCatalog";
import { setGenerationState } from "@/lib/products/progress";

function validBody(body: Partial<PurchaseInput>) {
  return body.purchaseId && body.productSlug && body.jobId && body.cityId;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<PurchaseInput>;

  if (!validBody(body) || !getCatalogProduct(body.productSlug!)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const input: PurchaseInput = {
    purchaseId: body.purchaseId!,
    productSlug: body.productSlug!,
    jobId: body.jobId!,
    cityId: body.cityId!,
    options: body.options ?? {},
  };

  setGenerationState(input.purchaseId, {
    status: "queued",
    progress: 5,
    stage: "Queued for generation",
    deliveryUrl: `/delivery/${input.purchaseId}?token=demo`,
  });

  void (async () => {
    try {
      setGenerationState(input.purchaseId, { status: "running", progress: 10, stage: "Starting generator" });
      await generateProduct(input, (progress, stage) => {
        setGenerationState(input.purchaseId, { status: "running", progress, stage });
      });
      setGenerationState(input.purchaseId, { status: "completed", progress: 100, stage: "Files ready" });
    } catch (error) {
      setGenerationState(input.purchaseId, {
        status: "failed",
        progress: 100,
        stage: "Generation failed",
        error: error instanceof Error ? error.message : "Unknown generation error",
      });
    }
  })();

  return NextResponse.json({
    purchaseId: input.purchaseId,
    statusUrl: `/api/generate-product/${input.purchaseId}`,
    deliveryUrl: `/delivery/${input.purchaseId}?token=demo`,
  });
}
