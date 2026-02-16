import { Metadata } from "next";
import { ProductCard } from "@/components/products/product-card";
import { PricingFAQ } from "@/components/products/pricing-faq";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Pricing | AvgPay Digital Products",
  description: "Explore AvgPay's one-time digital products for negotiation strategy, compensation benchmarking, and career pay planning.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        <section className="max-w-3xl space-y-4 text-center mx-auto">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900">AvgPay Pricing</h1>
          <p className="text-xl text-slate-600">
            Choose a one-time digital product to negotiate better, benchmark smarter, and plan your next salary jump.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </section>

        <PricingFAQ />
      </div>
    </main>
  );
}
