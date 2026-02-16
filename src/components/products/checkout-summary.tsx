import { Product } from "@/lib/products";

export function CheckoutSummary({ product }: { product: Product }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Checkout (simulated)</h1>
      <p className="mt-2 text-slate-600">This is a placeholder checkout to test the full purchase-to-delivery funnel.</p>

      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm uppercase tracking-wide text-slate-500">Order summary</p>
        <p className="mt-2 text-xl font-semibold text-slate-900">{product.title}</p>
        <p className="mt-1 text-slate-600">{product.outcome}</p>
        <p className="mt-4 text-3xl font-bold text-slate-900">${product.price}</p>
        <p className="text-sm text-slate-500">One-time purchase</p>
      </div>
    </section>
  );
}
