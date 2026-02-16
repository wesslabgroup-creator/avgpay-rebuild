import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutFlow } from "@/components/products/checkout-flow";
import { getCatalogProduct, PRODUCT_CATALOG } from "@/lib/products/productCatalog";

export function generateStaticParams() {
  return PRODUCT_CATALOG.map((product) => ({ productSlug: product.slug }));
}

export function generateMetadata({ params }: { params: { productSlug: string } }): Metadata {
  const product = getCatalogProduct(params.productSlug);
  return {
    title: product ? `Checkout ${product.title} | AvgPay` : "Checkout | AvgPay",
    description: "Personalize your digital product with job and city before completing simulated purchase.",
  };
}

export default function CheckoutPage({ params }: { params: { productSlug: string } }) {
  const product = getCatalogProduct(params.productSlug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-slate-900">Checkout (simulated)</h1>
          <p className="mt-2 text-slate-600">Complete personalization and we&apos;ll generate your files immediately.</p>
        </section>
        <CheckoutFlow product={product} />
      </div>
    </main>
  );
}
