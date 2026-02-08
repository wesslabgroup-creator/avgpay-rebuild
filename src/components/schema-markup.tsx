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

export const ArticleSchema = ({ headline, datePublished, authorName }: ArticleSchemaProps) => (
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
