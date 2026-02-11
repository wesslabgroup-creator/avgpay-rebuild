const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../src/app');
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://avgpay.com').replace(/\/$/, '');

const excludedSegments = new Set(['api', 'admin', 'dashboard', 'auth', '(marketing)']);
const excludedRoutes = new Set(['/login', '/signup']);

function isIndexableRoute(route) {
  if (excludedRoutes.has(route)) return false;
  return ![...excludedSegments].some((segment) => route === `/${segment}` || route.startsWith(`/${segment}/`));
}

function getStaticPages(dir) {
  let results = [];

  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.startsWith('[') && !file.startsWith('_') && !excludedSegments.has(file)) {
        results = results.concat(getStaticPages(filePath));
      }
      continue;
    }

    if (file === 'page.tsx') {
      const route = `/${path.relative(pagesDir, dir).replace(/\\/g, '/')}`.replace(/\/page$/, '').replace(/\/+/g, '/');
      const normalized = route === '/.' ? '/' : route;
      if (isIndexableRoute(normalized)) {
        results.push(normalized);
      }
    }
  }

  return results;
}

function generateSitemap() {
  const staticPages = [...new Set(getStaticPages(pagesDir))].sort();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticPages
    .map(
      (page) => `  <url>\n    <loc>${siteUrl}${page}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${page === '/' ? '1.0' : '0.8'}</priority>\n  </url>`,
    )
    .join('\n')}\n</urlset>`;

  fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), sitemap);
  console.log(`Sitemap generated for ${staticPages.length} indexable routes.`);
}

generateSitemap();
