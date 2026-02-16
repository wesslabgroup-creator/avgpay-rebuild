const FAQ_ITEMS = [
  {
    question: "Is this a subscription?",
    answer: "No. One-time purchase.",
  },
  {
    question: "Instant access?",
    answer: "Yes, after checkout goes live. For now you can preview the full delivery flow.",
  },
  {
    question: "Refunds?",
    answer: "We’ll publish the policy at checkout launch.",
  },
  {
    question: "Where does data come from?",
    answer: "AvgPay’s aggregated compensation data.",
  },
];

export function PricingFAQ() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
      <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {FAQ_ITEMS.map((item) => (
          <article key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="font-semibold text-slate-900">{item.question}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
