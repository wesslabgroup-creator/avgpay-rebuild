import { slugify } from "@/lib/utils";

interface ComparisonFaq {
  question: string;
  answer: string;
}

interface ComparisonCta {
  label: string;
  href: string;
}

export interface CuratedComparison {
  slug: string;
  title: string;
  description: string;
  summary: string;
  companies: string[];
  roles: string[];
  whyPopular: string;
  takeaways: string[];
  faqs: ComparisonFaq[];
  cta: ComparisonCta;
}

export const CURATED_COMPARISONS: CuratedComparison[] = [
  {
    slug: "software-engineer-google-vs-meta",
    title: "Software Engineer: Google vs Meta",
    description:
      "Compare compensation expectations, leveling dynamics, and negotiation leverage for Software Engineers choosing between Google and Meta.",
    summary:
      "One of the most searched Big Tech compensation matchups, especially at mid and senior levels in SF and NYC.",
    companies: ["Google", "Meta"],
    roles: ["Software Engineer"],
    whyPopular:
      "Google and Meta dominate demand from candidates evaluating high-equity vs high-cash offers.",
    takeaways: [
      "Meta packages frequently skew higher on equity upside.",
      "Google offers stronger stability signals and leveling consistency.",
      "Competing offers between these companies materially improve negotiation outcomes.",
    ],
    faqs: [
      {
        question: "Which company tends to offer higher total compensation for senior software engineers?",
        answer:
          "Meta often leads in upside-heavy packages, while Google can be more balanced between cash and equity depending on level and org.",
      },
      {
        question: "Should I anchor negotiations with Google or Meta first?",
        answer:
          "Start with whichever timeline is faster, then use written competing signals to improve both base and equity components.",
      },
    ],
    cta: { label: "Analyze My Google/Meta Offer", href: "/analyze-offer" },
  },
  {
    slug: "product-manager-google-vs-amazon",
    title: "Product Manager: Google vs Amazon",
    description:
      "A focused comparison for Product Managers deciding between Google and Amazon compensation structures and growth paths.",
    summary:
      "High-interest PM decision set due to very different performance cultures and pay composition.",
    companies: ["Google", "Amazon"],
    roles: ["Product Manager"],
    whyPopular:
      "PM candidates frequently cross-interview at both companies and need side-by-side offer framing.",
    takeaways: [
      "Google compensation tends to be steadier by level and location.",
      "Amazon can present wider variance tied to org, level mapping, and stock refresh expectations.",
      "Offer timing is critical because equity volatility can quickly change effective value.",
    ],
    faqs: [
      {
        question: "How should PM candidates compare equity between Google and Amazon?",
        answer:
          "Normalize equity to annualized value and scenario-test downside cases, especially if vesting or refresh assumptions differ.",
      },
      {
        question: "Is role scope worth trading for slightly lower first-year pay?",
        answer:
          "For PMs, scope can accelerate future compensation faster than a small initial delta, but only if promotion pathways are clear.",
      },
    ],
    cta: { label: "Run PM Offer Analyzer", href: "/analyze-offer" },
  },
  {
    slug: "software-engineer-amazon-vs-microsoft",
    title: "Software Engineer: Amazon vs Microsoft",
    description:
      "Compare two of the most common interview loops for engineers evaluating comp, growth velocity, and role stability.",
    summary:
      "Frequently requested by candidates optimizing for Seattle-area opportunities and long-term progression.",
    companies: ["Amazon", "Microsoft"],
    roles: ["Software Engineer"],
    whyPopular:
      "Both companies hire at scale and appear in many multi-offer negotiation cycles.",
    takeaways: [
      "Microsoft often offers predictability and durable work-life expectations.",
      "Amazon can provide stronger upside in high-growth teams with higher execution demands.",
      "Level matching accuracy has outsized impact on total comp comparisons.",
    ],
    faqs: [
      {
        question: "Do I compare Amazon and Microsoft offers by base salary first?",
        answer:
          "No—compare full annualized total compensation and include sign-on schedules, vesting cadence, and expected refresh behavior.",
      },
      {
        question: "What is the biggest negotiation miss in this pairing?",
        answer:
          "Candidates often fail to push on level calibration, which can outweigh bonus or sign-on deltas over time.",
      },
    ],
    cta: { label: "Compare My Engineering Offers", href: "/analyze-offer" },
  },
  {
    slug: "data-scientist-meta-vs-google",
    title: "Data Scientist: Meta vs Google",
    description:
      "A comparison for Data Scientists evaluating cash/equity mix, role scope, and long-term compensation trajectory.",
    summary:
      "Growing demand among ML and analytics candidates in major tech hubs.",
    companies: ["Meta", "Google"],
    roles: ["Data Scientist"],
    whyPopular:
      "Both firms remain top destinations for DS talent with intense cross-offer competition.",
    takeaways: [
      "Role definitions vary significantly between product analytics and ML-focused tracks.",
      "Comp packages should be evaluated against expected project impact and promotion velocity.",
      "Negotiating based on scarce skill signals (ML infra, experimentation) can unlock better terms.",
    ],
    faqs: [
      {
        question: "How do Data Scientist levels map across Meta and Google?",
        answer:
          "They are not one-to-one; candidates should ask for written scope expectations to avoid down-leveling risk.",
      },
      {
        question: "Should I prioritize equity upside or base stability?",
        answer:
          "That depends on your risk tolerance and time horizon—model multiple market outcomes before deciding.",
      },
    ],
    cta: { label: "Analyze My DS Offer", href: "/analyze-offer" },
  },
];

export function getComparisonBySlug(slug: string) {
  return CURATED_COMPARISONS.find((comparison) => comparison.slug === slug);
}

export function getComparisonsForCompany(company: string) {
  return CURATED_COMPARISONS.filter((comparison) => comparison.companies.includes(company));
}

export function getComparisonsForRole(role: string) {
  return CURATED_COMPARISONS.filter((comparison) => comparison.roles.includes(role));
}

export function getBestComparisonMatch(company: string, role: string) {
  const exactMatch = CURATED_COMPARISONS.find(
    (comparison) => comparison.companies.includes(company) && comparison.roles.includes(role)
  );

  if (exactMatch) return exactMatch;

  return CURATED_COMPARISONS.find((comparison) => comparison.companies.includes(company))
    ?? CURATED_COMPARISONS.find((comparison) => comparison.roles.includes(role));
}

export function getComparisonHref(slugOrTitle: string) {
  const slug = slugOrTitle.includes(" ") ? slugify(slugOrTitle) : slugOrTitle;
  return `/compare/${slug}`;
}
