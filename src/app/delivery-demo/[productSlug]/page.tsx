import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DownloadButton } from "@/components/products/download-button";
import { PRODUCTS, getProductBySlug } from "@/lib/products";

export const metadata: Metadata = {
  title: "Delivery | AvgPay",
  description: "Download your AvgPay digital purchase.",
  robots: {
    index: false,
    follow: false,
  },
};

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ productSlug: product.slug }));
}

export default function DeliveryPage({
  params,
  searchParams,
}: {
  params: { productSlug: string };
  searchParams: { token?: string };
}) {
  const product = getProductBySlug(params.productSlug);

  if (!product) {
    notFound();
  }

  const hasDemoToken = searchParams.token === "demo";

  if (!hasDemoToken) {
    return (
      <main className="min-h-screen bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Demo delivery access required</h1>
          <p className="mt-3 text-slate-600">This is a demo delivery page. Start at Pricing.</p>
          <Link href="/pricing" className="mt-6 inline-block text-emerald-700 hover:text-emerald-800">
            Go to Pricing
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">Thanks for your purchase (simulated)</h1>
          <p className="mt-2 text-slate-600">
            Your files are ready below. In production, this page appears right after successful checkout.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-xl font-semibold text-slate-900">Downloads</h2>
          <div className="mt-4 flex flex-col gap-3">
            {product.deliverables.map((deliverable) => (
              <DownloadButton key={deliverable.path} deliverable={deliverable} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900">Receipt (simulated)</h2>
          <p className="mt-3 text-slate-700">Product: {product.title}</p>
          <p className="text-slate-700">Amount: ${product.price}.00 (one-time)</p>
          <p className="text-slate-700">Order ID: DEMO-{product.slug.toUpperCase()}</p>
          <p className="mt-4 text-sm text-slate-600">
            Need help? Contact support at support@avgpay.com.
          </p>
        </section>
      </div>
    </main>
  );
}
