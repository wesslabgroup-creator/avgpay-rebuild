export type ProductSlug = "salary-negotiation-kit" | "compensation-benchmark-report" | "career-pay-blueprint";

export type CatalogProduct = {
  slug: ProductSlug;
  title: string;
  price: number;
  outcome: string;
  description: string;
  bestSeller?: boolean;
  features: string[];
  whoItsFor: string[];
};

export const PRODUCT_CATALOG: CatalogProduct[] = [
  {
    slug: "salary-negotiation-kit",
    title: "Salary Negotiation Kit",
    price: 39,
    outcome: "Know exactly what to ask for and how to say it.",
    description: "Consulting-grade negotiation playbook with scripts, templates, and closing language.",
    features: ["12–20 page negotiation PDF", "Copy/paste templates TXT", "Designed checklist PDF", "Bundle ZIP"],
    whoItsFor: ["Candidates entering offer negotiation", "Professionals requesting a raise", "Anyone who wants confident compensation language"],
  },
  {
    slug: "compensation-benchmark-report",
    title: "Compensation Benchmark Report",
    price: 49,
    outcome: "A consulting-grade salary report for your job + city.",
    description: "Beautiful personalized benchmark with percentile interpretation and recommendations.",
    bestSeller: true,
    features: ["15–25 page benchmark PDF", "Companion benchmark CSV", "Bundle ZIP", "Underpaid risk scoring"],
    whoItsFor: ["Professionals benchmarking market position", "Offer negotiation prep", "Career switch planning"],
  },
  {
    slug: "career-pay-blueprint",
    title: "Career Path Pay Blueprint",
    price: 59,
    outcome: "Your next 12 months mapped to a higher salary.",
    description: "Personalized roadmap with role pathways, skills ROI, and execution plans.",
    features: ["12–20 page roadmap PDF", "Career roadmap CSV", "Bundle ZIP", "Outreach and proof-of-work scripts"],
    whoItsFor: ["Professionals planning compensation growth", "People targeting a role jump", "Operators wanting a concrete plan"],
  },
];

export function getCatalogProduct(slug: string) {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}
