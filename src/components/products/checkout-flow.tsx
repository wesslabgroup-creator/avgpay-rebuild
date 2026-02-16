"use client";

import { useMemo, useState } from "react";
import { CatalogProduct } from "@/lib/products/productCatalog";
import { Button } from "@/components/ui/button";

type Option = { id: string; label: string };

async function search(endpoint: string, q: string) {
  const res = await fetch(`/api/search/${endpoint}?q=${encodeURIComponent(q)}`);
  return (await res.json()).results as Option[];
}

export function CheckoutFlow({ product }: { product: CatalogProduct }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [jobQuery, setJobQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [jobResults, setJobResults] = useState<Option[]>([]);
  const [cityResults, setCityResults] = useState<Option[]>([]);
  const [job, setJob] = useState<Option | null>(null);
  const [city, setCity] = useState<Option | null>(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<Record<string, string>>({});

  const canContinue = !!job && !!city;

  const purchaseSummary = useMemo(
    () => ({ job: job?.label ?? "-", city: city?.label ?? "-", price: product.price }),
    [job, city, product.price]
  );

  async function completePurchase() {
    if (!job || !city) return;
    setLoading(true);
    const purchaseId = `p_${Date.now()}`;

    const payload = {
      purchaseId,
      productSlug: product.slug,
      jobId: job.id,
      cityId: city.id,
      options: {
        yearsExperience: options.years_experience ? Number(options.years_experience) : undefined,
        industry: options.industry,
        company: options.company,
        remotePreference: options.remote_preference,
        currentSalary: options.current_salary ? Number(options.current_salary) : undefined,
        targetSalary: options.target_salary ? Number(options.target_salary) : undefined,
        hasOffer: options.has_offer,
        offerAmount: options.offer_amount ? Number(options.offer_amount) : undefined,
        level: options.level,
        targetRole: options.target_role,
        timeline: options.timeline,
      },
    };

    const res = await fetch("/api/generate-product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    window.location.href = data.deliveryUrl;
  }

  return (
    <div className="space-y-6">
      {step === 1 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Step 1: Personalize your report</h2>
          <p className="mt-2 text-slate-600">Job + City are required. We generate files specifically for this context.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-700">Job title *</label>
              <input value={jobQuery} onChange={async (e) => { const q = e.target.value; setJobQuery(q); setJobResults(await search("jobs", q)); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="e.g. Software Engineer" />
              <div className="mt-2 space-y-1">{jobResults.map((r) => <button key={r.id} onClick={() => { setJob(r); setJobQuery(r.label); setJobResults([]); }} className="block w-full rounded border border-slate-200 px-2 py-1 text-left text-sm hover:bg-slate-50">{r.label}</button>)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">City *</label>
              <input value={cityQuery} onChange={async (e) => { const q = e.target.value; setCityQuery(q); setCityResults(await search("cities", q)); }} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" placeholder="e.g. San Francisco, CA" />
              <div className="mt-2 space-y-1">{cityResults.map((r) => <button key={r.id} onClick={() => { setCity(r); setCityQuery(r.label); setCityResults([]); }} className="block w-full rounded border border-slate-200 px-2 py-1 text-left text-sm hover:bg-slate-50">{r.label}</button>)}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["years_experience", "Years experience"], ["industry", "Industry"], ["company", "Company"], ["remote_preference", "Remote preference"],
              ["current_salary", "Current salary"], ["target_salary", "Target salary"], ["has_offer", "Has offer (yes/no)"], ["offer_amount", "Offer amount"],
              ["level", "Level"], ["target_role", "Target role"], ["timeline", "Timeline (3/6/12)"]
            ].map(([key, label]) => (
              <input key={key} placeholder={label} className="rounded-md border border-slate-300 px-3 py-2" onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.value }))} />
            ))}
          </div>

          <Button disabled={!canContinue} className="mt-6" onClick={() => setStep(2)}>Continue to Review</Button>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-semibold text-slate-900">Step 2: Review</h2>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-700 space-y-2">
            <p>Product: <strong>{product.title}</strong></p>
            <p>Job: <strong>{purchaseSummary.job}</strong></p>
            <p>City: <strong>{purchaseSummary.city}</strong></p>
            <p>Price: <strong>${purchaseSummary.price} (one-time)</strong></p>
            <p>You will receive generated PDF/CSV/TXT assets and a ZIP bundle instantly.</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={completePurchase} disabled={loading}>{loading ? "Generating files..." : "Complete purchase (simulated)"}</Button>
          </div>
        </section>
      )}
    </div>
  );
}
