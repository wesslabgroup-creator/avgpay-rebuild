export type ProductDeliverable = {
  label: string;
  path: string;
  fileName: string;
};

export type Product = {
  title: string;
  slug: "salary-negotiation-kit" | "compensation-benchmark-report" | "career-pay-blueprint";
  price: number;
  outcome: string;
  description: string;
  features: string[];
  whoItsFor: string[];
  afterPurchase: string;
  bestSeller?: boolean;
  deliverables: ProductDeliverable[];
};

export const PRODUCTS: Product[] = [
  {
    title: "Salary Negotiation Kit",
    slug: "salary-negotiation-kit",
    price: 39,
    outcome: "Know exactly what to ask for and how to say it.",
    description: "A practical negotiation system with scripts, templates, and response playbooks you can use immediately.",
    features: [
      "Salary Negotiation Kit PDF (strategy + scripts + responses)",
      "Copy-and-paste negotiation templates (TXT)",
      "Negotiation checklist PDF",
      "Single ZIP download for instant access",
    ],
    whoItsFor: [
      "Job seekers preparing for an offer conversation",
      "Professionals planning a raise request",
      "Anyone who wants structured language for high-stakes compensation discussions",
    ],
    afterPurchase: "After checkout goes live, you'll get instant access to the complete ZIP bundle on your delivery page.",
    deliverables: [
      {
        label: "Download Salary Negotiation Kit Bundle (.zip)",
        path: "/api/download/salary-negotiation-kit",
        fileName: "avgpay-salary-negotiation-kit.zip",
      },
    ],
  },
  {
    title: "Compensation Benchmark Report",
    slug: "compensation-benchmark-report",
    price: 49,
    outcome: "A consulting-grade salary report for your job + city.",
    description: "A polished benchmark report explaining ranges, role comparisons, and risk indicators using illustrative sample data.",
    features: [
      "10-15 page benchmark PDF report",
      "Illustrative percentile and company-tier comparisons",
      "Underpaid risk score framework explanation",
      "Sample benchmark CSV export",
    ],
    whoItsFor: [
      "Candidates validating if their current package is competitive",
      "Professionals preparing for compensation review cycles",
      "People deciding between role, city, and tier trade-offs",
    ],
    afterPurchase: "After checkout goes live, your delivery page will include the benchmark PDF and companion CSV immediately.",
    bestSeller: true,
    deliverables: [
      {
        label: "Download Benchmark Report (.pdf)",
        path: "/products/compensation-benchmark-report/compensation-benchmark-report.pdf",
        fileName: "avgpay-compensation-benchmark-report.pdf",
      },
      {
        label: "Download Benchmark Data (.csv)",
        path: "/products/compensation-benchmark-report/compensation-benchmark-sample-data.csv",
        fileName: "avgpay-compensation-benchmark-sample-data.csv",
      },
    ],
  },
  {
    title: "Career Path Pay Blueprint",
    slug: "career-pay-blueprint",
    price: 59,
    outcome: "Your next 12 months mapped to a higher salary.",
    description: "A guided roadmap for advancing to better-paying roles, backed by a practical execution plan and tracking sheet.",
    features: [
      "Career Path Pay Blueprint PDF",
      "30/60/90-day and 12-month planning framework",
      "Illustrative next-role options and skills ROI",
      "Roadmap spreadsheet (CSV)",
    ],
    whoItsFor: [
      "Professionals planning their next role transition",
      "People who want a weekly execution plan tied to compensation growth",
      "Anyone balancing local-city versus remote compensation options",
    ],
    afterPurchase: "After checkout goes live, you'll get instant access to the blueprint PDF and roadmap spreadsheet from the delivery page.",
    deliverables: [
      {
        label: "Download Career Path Blueprint (.pdf)",
        path: "/products/career-pay-blueprint/career-path-pay-blueprint.pdf",
        fileName: "avgpay-career-path-pay-blueprint.pdf",
      },
      {
        label: "Download Roadmap Spreadsheet (.csv)",
        path: "/products/career-pay-blueprint/career-path-roadmap.csv",
        fileName: "avgpay-career-path-roadmap.csv",
      },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}
