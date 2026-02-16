import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProductHero } from "@/components/products/product-hero";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ productSlug: product.slug }));
}

export function generateMetadata({ params }: { params: { productSlug: string } }): Metadata {
  const product = getProductBySlug(params.productSlug);

  if (!product) {
    return {
      title: "Product Not Found | AvgPay",
    };
  }

  return {
    title: `${product.title} | AvgPay`,
    description: `${product.outcome} ${product.description}`,
  };
}

export default function ProductDetailPage({ params }: { params: { productSlug: string } }) {
  const product = getProductBySlug(params.productSlug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <ProductHero product={product} />

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">What you get</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Who it&apos;s for</h2>
          <ul className="mt-4 space-y-2 text-slate-700">
            {product.whoItsFor.map((audience) => (
              <li key={audience}>• {audience}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">What happens after you buy</h2>
          <p className="mt-3 text-slate-700">{product.afterPurchase}</p>
          <Link href={`/checkout/${product.slug}`} className="mt-6 inline-block">
            <Button className="px-8 py-3 text-base">Buy now</Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
