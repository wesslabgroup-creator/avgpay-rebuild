import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductHero } from "@/components/products/product-hero";
import { Button } from "@/components/ui/button";
import { getCatalogProduct, PRODUCT_CATALOG } from "@/lib/products/productCatalog";

export function generateStaticParams() {
  return PRODUCT_CATALOG.map((product) => ({ productSlug: product.slug }));
}

export function generateMetadata({ params }: { params: { productSlug: string } }): Metadata {
  const product = getCatalogProduct(params.productSlug);
  return {
    title: product ? `${product.title} | AvgPay` : "Product | AvgPay",
    description: product ? `${product.outcome} ${product.description}` : "AvgPay digital product",
  };
}

export default function ProductPage({ params }: { params: { productSlug: string } }) {
  const product = getCatalogProduct(params.productSlug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <ProductHero product={product} />

        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">What you get</h2>
          <ul className="mt-4 space-y-2 text-slate-700">{product.features.map((feature) => <li key={feature}>• {feature}</li>)}</ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Who it&apos;s for</h2>
          <ul className="mt-4 space-y-2 text-slate-700">{product.whoItsFor.map((item) => <li key={item}>• {item}</li>)}</ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">How it works (Job + City personalization)</h2>
          <p className="mt-3 text-slate-700">In checkout, you select your Job and City. We generate personalized files (PDF + data pack + ZIP) and deliver instantly once checkout is completed (simulated for now).</p>
          <Link href={`/checkout/${product.slug}`} className="mt-6 inline-block"><Button className="px-8">Get Instant Download</Button></Link>
        </section>
      </div>
    </main>
  );
}
