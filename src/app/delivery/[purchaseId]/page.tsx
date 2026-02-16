import { Metadata } from "next";
import Link from "next/link";
import { readPurchaseMeta } from "@/lib/products/storage";

export const metadata: Metadata = {
  title: "Delivery | AvgPay",
  robots: { index: false, follow: false },
};

export default async function DeliveryPage({ params, searchParams }: { params: { purchaseId: string }; searchParams: { token?: string } }) {
  if (searchParams.token !== "demo") {
    return (
      <main className="min-h-screen bg-white px-6 py-20"><div className="mx-auto max-w-xl rounded-xl border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold">This is a demo delivery page. Start at Pricing.</h1>
        <Link href="/pricing" className="mt-4 inline-block text-emerald-700">Go to Pricing</Link>
      </div></main>
    );
  }

  let meta;
  try {
    meta = await readPurchaseMeta(params.purchaseId);
  } catch {
    return <main className="min-h-screen bg-white px-6 py-20"><div className="mx-auto max-w-xl">Purchase not found.</div></main>;
  }

  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-slate-900">Thanks for your purchase (simulated)</h1>
          <p className="mt-2 text-slate-600">{meta.productTitle} • {meta.job.label} • {meta.city.label}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-xl font-semibold">Downloads</h2>
          <div className="mt-4 space-y-3">
            {meta.files.map((file: { label: string; path: string }) => (
              <a key={file.path} href={file.path} className="inline-flex rounded-md bg-emerald-600 px-4 py-2 text-white">{file.label}</a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold">What&apos;s inside</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700">
            {meta.files.map((file: { label: string }) => <li key={file.label}>{file.label}</li>)}
          </ul>
          <p className="mt-4 text-sm text-slate-600">Receipt ID: {meta.purchaseId} • Generated {new Date(meta.createdAt).toLocaleString()}</p>
        </section>
      </div>
    </main>
  );
}
