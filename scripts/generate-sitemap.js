// This script generates sitemap.xml for all static pages

const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../src/app');
const siteUrl = 'https://avgpay-rebuild.vercel.app';

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildComparisonPages(values) {
  const pages = [];
  for (let i = 0; i < values.length; i += 1) {
    for (let j = i + 1; j < values.length; j += 1) {
      pages.push(`/compare/${slugify(values[i])}-vs-${slugify(values[j])}`);
    }
  }
  return pages;
}

function getStaticPages(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'api' && !file.startsWith('[') && !file.startsWith('_')) {
        results = results.concat(getStaticPages(filePath));
      }
    } else if (file === 'page.tsx') {
      const route = path.relative(pagesDir, dir).replace(/\\/g, '/');
      results.push(`/${route}`);
    }
  });
  return results;
}

function generateSitemap() {
  const staticPages = getStaticPages(pagesDir);

  // Add programmatic salary pages (mocked for now)
  const companies = ["Google", "Meta", "Amazon", "Apple", "Microsoft"];
  const roles = ["Software Engineer", "Product Manager"];
  const locations = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Redmond, WA", "Cupertino, CA"];

  const programmaticPages = companies.flatMap((c) =>
    roles.flatMap((r) =>
      locations.map((l) => `/${encodeURIComponent(c)}/${encodeURIComponent(r)}/${encodeURIComponent(l.replace(', ', '-'))}`)
    )
  );

  const comparisonPages = [
    ...buildComparisonPages(companies),
    ...buildComparisonPages(roles),
    ...buildComparisonPages(locations),
  ];

  const allPages = [...new Set([...staticPages, ...programmaticPages, ...comparisonPages])];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${siteUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap();
