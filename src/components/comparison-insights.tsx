interface ComparisonStats {
  medianTotalComp: number;
  medianBaseSalary: number;
  medianNonBaseComp: number;
  sampleSize: number;
}

interface ComparisonNarrative {
  philosophicalDivergence: string;
  culturalTradeOff: string;
  winnerProfileA: string;
  winnerProfileB: string;
}

interface ComparisonInsightsProps {
  entityA: string;
  entityB: string;
  statsA: ComparisonStats;
  statsB: ComparisonStats;
  tradeOffSummary: string;
  narrative: ComparisonNarrative;
}

function formatCurrency(value: number) {
  if (!value) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDelta(value: number) {
  const abs = Math.abs(value);
  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatCurrency(abs)}`;
}

function WinnerBadge({ isWinner }: { isWinner: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        isWinner ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {isWinner ? "Leads on median comp" : "Trailing median comp"}
    </span>
  );
}

export function ComparisonInsights({
  entityA,
  entityB,
  statsA,
  statsB,
  tradeOffSummary,
  narrative,
}: ComparisonInsightsProps) {
  const totalCompDelta = statsA.medianTotalComp - statsB.medianTotalComp;
  const nonBaseDelta = statsA.medianNonBaseComp - statsB.medianNonBaseComp;

  const aLeadsTotalComp = totalCompDelta >= 0;
  const bLeadsTotalComp = totalCompDelta <= 0;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">A vs B decision frame</h2>
      <p className="mt-2 text-slate-600">
        Compare median compensation, non-base upside (equity/bonus/perks), and cultural fit to understand how
        each offer maps to your priorities.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
        <article className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">{entityA}</h3>
            <WinnerBadge isWinner={aLeadsTotalComp} />
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median total compensation</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsA.medianTotalComp)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median base salary</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsA.medianBaseSalary)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median equity/bonus/benefit value</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsA.medianNonBaseComp)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Samples</dt>
              <dd className="font-semibold text-slate-900">{statsA.sampleSize.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-lg border border-emerald-200 bg-white p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Winner profile ({entityA}-fit)</p>
            <p className="mt-1">{narrative.winnerProfileA}</p>
          </div>
        </article>

        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
            Trade-off Summary
          </div>
          <div className="mt-3 w-full max-w-xs rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-slate-700">
            {tradeOffSummary}
          </div>
        </div>

        <article className="rounded-xl border border-blue-200 bg-blue-50/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-semibold text-slate-900">{entityB}</h3>
            <WinnerBadge isWinner={bLeadsTotalComp} />
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median total compensation</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsB.medianTotalComp)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median base salary</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsB.medianBaseSalary)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Median equity/bonus/benefit value</dt>
              <dd className="font-semibold text-slate-900">{formatCurrency(statsB.medianNonBaseComp)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-slate-500">Samples</dt>
              <dd className="font-semibold text-slate-900">{statsB.sampleSize.toLocaleString()}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-lg border border-blue-200 bg-white p-3 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Winner profile ({entityB}-fit)</p>
            <p className="mt-1">{narrative.winnerProfileB}</p>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Philosophical Divergence</h3>
          <p className="mt-2 text-slate-700">{narrative.philosophicalDivergence}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Cultural Trade-off</h3>
          <p className="mt-2 text-slate-700">{narrative.culturalTradeOff}</p>
        </article>
      </div>

      <article className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-700">Compensation & benefit deltas</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-white/80 bg-white p-3">
            <p className="text-xs text-slate-500">Median total compensation delta ({entityA} - {entityB})</p>
            <p className={`mt-1 text-lg font-bold ${totalCompDelta >= 0 ? "text-emerald-700" : "text-blue-700"}`}>
              {formatDelta(totalCompDelta)}
            </p>
          </div>
          <div className="rounded-lg border border-white/80 bg-white p-3">
            <p className="text-xs text-slate-500">Median equity/bonus/benefit delta ({entityA} - {entityB})</p>
            <p className={`mt-1 text-lg font-bold ${nonBaseDelta >= 0 ? "text-emerald-700" : "text-blue-700"}`}>
              {formatDelta(nonBaseDelta)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-700">
          Candidate implication: a higher non-base value can boost upside, but it usually comes with volatility and vesting risk.
          Weigh that against your near-term cash needs and expected tenure.
        </p>
      </article>
    </section>
  );
}
