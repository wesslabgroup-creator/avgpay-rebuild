"use client";

import { useMemo, useState } from "react";
import { CatalogProduct } from "@/lib/products/productCatalog";
import { Button } from "@/components/ui/button";

type Option = { id: string; label: string };

type GenerationStatus = {
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  stage: string;
  error?: string;
  deliveryUrl?: string;
};

async function search(endpoint: string, q: string) {
  const res = await fetch(`/api/search/${endpoint}?q=${encodeURIComponent(q)}`);
  return (await res.json()).results as Option[];
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
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
  const [status, setStatus] = useState<GenerationStatus | null>(null);

  const canContinue = !!job && !!city;

  const purchaseSummary = useMemo(
    () => ({ job: job?.label ?? "-", city: city?.label ?? "-", price: product.price }),
    [job, city, product.price]
  );

  async function completePurchase() {
    if (!job || !city) return;
    setLoading(true);
    setStatus({ status: "queued", progress: 3, stage: "Preparing request" });
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

    try {
      const res = await fetch("/api/generate-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to start generation.");
      }

      const data = await res.json();
      setStatus({ status: "running", progress: 8, stage: "Generation started" });

      for (let attempt = 0; attempt < 180; attempt++) {
        const statusRes = await fetch(data.statusUrl, { cache: "no-store" });
        const next = (await statusRes.json()) as GenerationStatus;
        setStatus(next);

        if (next.status === "completed") {
          window.location.href = next.deliveryUrl ?? data.deliveryUrl;
          return;
        }

        if (next.status === "failed") {
          throw new Error(next.error ?? "Generation failed");
        }

        await wait(750);
      }

      throw new Error("Generation timed out. Please try again.");
    } catch (error) {
      setStatus({
        status: "failed",
        progress: 100,
        stage: "Generation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
      setLoading(false);
    }
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

          {status && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between text-sm text-slate-700">
                <span>{status.stage}</span>
                <span>{Math.min(100, Math.max(0, Math.round(status.progress)))}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-emerald-600 transition-all" style={{ width: `${Math.min(100, Math.max(0, status.progress))}%` }} />
              </div>
              {status.error && <p className="mt-2 text-sm text-red-600">{status.error}</p>}
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>Back</Button>
            <Button onClick={completePurchase} disabled={loading}>{loading ? "Generating files..." : "Complete purchase (simulated)"}</Button>
          </div>
        </section>
      )}
    </div>
  );
}
