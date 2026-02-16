import { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { PricingFAQ } from "@/components/products/pricing-faq";
import { PRODUCT_CATALOG } from "@/lib/products/productCatalog";

export const metadata: Metadata = {
  title: "Pricing | AvgPay Digital Products",
  description: "Browse one-time digital products for negotiation, benchmarks, and career pay strategy.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">AvgPay Pricing</h1>
          <p className="text-xl text-slate-600">One-time digital products with instant generated downloads (simulated checkout).</p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {PRODUCT_CATALOG.map((product) => <ProductCard key={product.slug} product={product} />)}
        </section>

        <PricingFAQ />
      </div>
    </main>
  );
}
