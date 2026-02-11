// Generates public/sitemap.xml with crawlable, user-facing routes only.

const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../src/app');
const outputFile = path.resolve(__dirname, '../public/sitemap.xml');
const siteUrl = 'https://avgpay-rebuild.vercel.app';

const EXCLUDED_SEGMENTS = new Set([
  'api',
  'admin',
  'auth',
  'dashboard',
  'login',
  'signup',
]);

const EXCLUDED_ROUTES = new Set(['/not-found', '/error']);

const guideSlugs = [
  'pm-compensation-2026',
  'negotiation',
  'equity',
  'swe-compensation-2026',
  'remote-pay',
  'startup-vs-bigtech',
];

const comparisonSlugs = [
  'software-engineer-google-vs-meta',
  'product-manager-google-vs-amazon',
  'software-engineer-amazon-vs-microsoft',
  'data-scientist-meta-vs-google',
];

function getStaticPages(dir) {
  let results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') || entry.name.startsWith('_') || EXCLUDED_SEGMENTS.has(entry.name)) {
        continue;
      }
      results = results.concat(getStaticPages(entryPath));
      continue;
    }

    if (entry.name === 'page.tsx') {
      const route = `/${path.relative(pagesDir, dir).replace(/\\/g, '/')}`.replace(/\/page$/, '');
      results.push(route === '/.' ? '/' : route);
    }
  }

  return results;
}

function toUrlEntry(route, priority = 0.8, changefreq = 'weekly') {
  return {
    loc: `${siteUrl}${route}`,
    priority,
    changefreq,
  };
}

function generateSitemap() {
  const staticPages = getStaticPages(pagesDir).filter((route) => !EXCLUDED_ROUTES.has(route));

  const programmaticPages = [
    ...guideSlugs.map((slug) => `/guides/${slug}`),
    ...comparisonSlugs.map((slug) => `/compare/${slug}`),
  ];

  const allPages = [...new Set([...staticPages, ...programmaticPages])];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allPages
    .map((route) => {
      const priority = route === '/' ? 1.0 : route.startsWith('/guides/') || route.startsWith('/tools') ? 0.9 : 0.8;
      const changefreq = route === '/' ? 'daily' : 'weekly';
      const entry = toUrlEntry(route, priority, changefreq);
      return `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`;
    })
    .join('\n')}\n</urlset>`;

  fs.writeFileSync(outputFile, sitemap);
  console.log(`Sitemap generated successfully with ${allPages.length} URLs.`);
}

generateSitemap();
