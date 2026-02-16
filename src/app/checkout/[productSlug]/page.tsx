import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutSummary } from "@/components/products/checkout-summary";
import { Button } from "@/components/ui/button";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ productSlug: product.slug }));
}

export function generateMetadata({ params }: { params: { productSlug: string } }): Metadata {
  const product = getProductBySlug(params.productSlug);

  return {
    title: product ? `Checkout ${product.title} | AvgPay` : "Checkout | AvgPay",
    description: product
      ? `Simulated checkout for ${product.title}.`
      : "Simulated checkout for AvgPay digital products.",
  };
}

export default function CheckoutPage({ params }: { params: { productSlug: string } }) {
  const product = getProductBySlug(params.productSlug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <CheckoutSummary product={product} />

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-600">
            No payment is processed in this flow. Clicking below simulates a successful purchase.
          </p>
          <Link href={`/delivery/${product.slug}?token=demo`} className="mt-4 inline-block">
            <Button className="px-8">Complete purchase (simulated)</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
