import { NextRequest, NextResponse } from "next/server";
import { generateProduct } from "@/lib/products/generateProduct";
import { PurchaseInput } from "@/lib/products/meta";
import { getCatalogProduct } from "@/lib/products/productCatalog";

function validBody(body: Partial<PurchaseInput>) {
  return body.purchaseId && body.productSlug && body.jobId && body.cityId;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<PurchaseInput>;

  if (!validBody(body) || !getCatalogProduct(body.productSlug!)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await generateProduct({
    purchaseId: body.purchaseId!,
    productSlug: body.productSlug!,
    jobId: body.jobId!,
    cityId: body.cityId!,
    options: body.options ?? {},
  });

  return NextResponse.json(result);
}
