import { CatalogProduct } from "@/lib/products/productCatalog";

export function ProductHero({ product }: { product: CatalogProduct }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{product.title}</h1>
          <p className="text-lg text-slate-600">{product.outcome}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 px-6 py-4 text-right">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">One-time</p>
          <p className="text-4xl font-bold text-emerald-700">${product.price}</p>
        </div>
      </div>
    </section>
  );
}
