import Link from "next/link";
import { CatalogProduct } from "@/lib/products/productCatalog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-2xl text-slate-900">{product.title}</CardTitle>
          {product.bestSeller && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Best Seller</span>}
        </div>
        <CardDescription className="text-base text-slate-600">{product.outcome}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-3xl font-bold text-slate-900">${product.price}<span className="ml-2 text-sm text-slate-500">one-time</span></p>
        <ul className="space-y-2 text-sm text-slate-700">{product.features.slice(0, 3).map((feature) => <li key={feature}>• {feature}</li>)}</ul>
        <Link href={`/products/${product.slug}`}><Button className="w-full">View details</Button></Link>
      </CardContent>
    </Card>
  );
}
