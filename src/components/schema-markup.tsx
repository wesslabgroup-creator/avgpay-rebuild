// components/SchemaMarkup.tsx
import Script from 'next/script';

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

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => (
  <Script id="breadcrumb-schema" type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          ${items.map((item, index) => `{
            "@type": "ListItem",
            "position": ${index + 1},
            "name": "${item.name}",
            "item": "${item.item}"
          }`).join(',')}
        ]
      }
    `}
  </Script>
);

export const ArticleSchema = ({ headline, datePublished, authorName, description }: ArticleSchemaProps) => (
  <Script id="article-schema" type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "${headline}",
        "datePublished": "${datePublished}",
        "author": {
          "@type": "Person",
          "name": "${authorName}"
        },
        ${description ? `"description": "${description}",` : ''}
        "publisher": {
          "@type": "Organization",
          "name": "AvgPay",
          "logo": {
            "@type": "ImageObject",
            "url": "https://avgpay-rebuild.vercel.app/favicon.svg"
          }
        }
      }
    `}
  </Script>
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
  description = `Verified salary data for ${jobTitle} positions at ${company} in ${location}.`
}: JobPostingSchemaProps) => (
  <Script id="job-posting-schema" type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobTitle,
      "description": description,
      "datePosted": datePosted,
      "hiringOrganization": {
        "@type": "Organization",
        "name": company
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location.split(", ")[0],
          "addressRegion": location.split(", ")[1] || "",
          "addressCountry": "US"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": baseSalary.min,
          "maxValue": baseSalary.max,
          "median": baseSalary.median,
          "unitText": "YEAR"
        }
      },
      "employmentType": "FULL_TIME"
    })}
  </Script>
);

export const OrganizationSchema = () => (
  <Script id="organization-schema" type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "AvgPay",
        "url": "https://avgpay.com",
        "logo": "https://avgpay.com/logo.png",
        "sameAs": [
          "https://twitter.com/avgpay",
          "https://linkedin.com/company/avgpay"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "",
          "contactType": "customer support",
          "email": "support@avgpay.com"
        }
      }
    `}
  </Script>
);

export const WebSiteSchema = () => (
  <Script id="website-schema" type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AvgPay",
        "url": "https://avgpay.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://avgpay.com/salaries?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    `}
  </Script>
);
