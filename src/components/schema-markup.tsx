import Script from "next/script";
import { getAbsoluteUrl, siteConfig } from "@/lib/site-config";

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface ArticleSchemaProps {
  headline: string;
  datePublished: string;
  authorName: string;
  description?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => (
  <Script
    id="breadcrumb-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.item,
        })),
      }),
    }}
  />
);

export const ArticleSchema = ({ headline, datePublished, authorName, description }: ArticleSchemaProps) => (
  <Script
    id="article-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        datePublished,
        ...(description ? { description } : {}),
        author: {
          "@type": "Person",
          name: authorName,
        },
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: getAbsoluteUrl("/favicon.svg"),
          },
        },
      }),
    }}
  />
);

interface JobPostingSchemaProps {
  jobTitle: string;
  company: string;
  location: string;
  baseSalary: {
    min: number;
    max: number;
    median: number;
  };
  datePosted?: string;
  description?: string;
}

export const JobPostingSchema = ({
  jobTitle,
  company,
  location,
  baseSalary,
  datePosted = new Date().toISOString(),
  description = `Verified salary data for ${jobTitle} positions at ${company} in ${location}.`,
}: JobPostingSchemaProps) => (
  <Script
    id="job-posting-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JobPosting",
        title: jobTitle,
        description,
        datePosted,
        hiringOrganization: {
          "@type": "Organization",
          name: company,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: location.split(", ")[0],
            addressRegion: location.split(", ")[1] || "",
            addressCountry: "US",
          },
        },
        baseSalary: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: {
            "@type": "QuantitativeValue",
            minValue: baseSalary.min,
            maxValue: baseSalary.max,
            median: baseSalary.median,
            unitText: "YEAR",
          },
        },
        employmentType: "FULL_TIME",
      }),
    }}
  />
);

export const OrganizationSchema = () => (
  <Script
    id="organization-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: getAbsoluteUrl("/favicon.svg"),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@avgpay.com",
        },
      }),
    }}
  />
);

export const WebSiteSchema = () => (
  <Script
    id="website-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: `${getAbsoluteUrl("/salaries")}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      }),
    }}
  />
);

export const FAQSchema = ({ items }: { items: FAQItem[] }) => (
  <Script
    id="faq-schema"
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }),
    }}
  />
);
