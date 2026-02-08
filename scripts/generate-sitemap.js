// This script generates sitemap.xml for all static pages

const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../src/app');
const siteUrl = 'https://avgpay-rebuild.vercel.app';

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
  
  // Add programmatic pages (mocked for now)
  const companies = ["Google", "Meta", "Amazon"];
  const roles = ["Software-Engineer", "Product-Manager"];
  const locations = ["San-Francisco-CA", "New-York-NY"];
  
  const programmaticPages = companies.flatMap(c => 
    roles.flatMap(r => 
      locations.map(l => `/${c}/${r}/${l}`)
    )
  );

  const allPages = [...new Set([...staticPages, ...programmaticPages])];

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
