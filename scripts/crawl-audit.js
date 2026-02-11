#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(process.cwd(), 'src');
const appDir = path.join(srcDir, 'app');
const pagePattern = /page\.(t|j)sx?$/;
const sourcePattern = /\.(t|j)sx?$/;
const hrefPattern = /href\s*=\s*["'`]([^"'`]+)["'`]/g;
const excludedRoutes = [/^\/api\//, /^\/admin/, /^\/auth\//, /^\/dashboard$/, /^\/login$/, /^\/signup$/];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

function routeFromPage(filePath) {
  const rel = path.relative(appDir, filePath).split(path.sep).join('/');
  const parts = rel.split('/').slice(0, -1).filter((seg) => !seg.startsWith('('));
  return parts.length ? `/${parts.join('/')}` : '/';
}

function normalizeHref(href) {
  const normalized = href.split('?')[0].split('#')[0] || '/';
  return normalized.length > 1 && normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

function isIndexable(route) {
  return !excludedRoutes.some((pattern) => pattern.test(route));
}

const allSourceFiles = walk(srcDir).filter((filePath) => sourcePattern.test(path.basename(filePath)));
const pageFiles = allSourceFiles.filter((filePath) => pagePattern.test(path.basename(filePath)));
const routes = pageFiles.map((filePath) => ({ filePath, route: routeFromPage(filePath) }));
const routeSet = new Set(routes.map((r) => r.route));
const inLinks = new Map(routes.map((r) => [r.route, 0]));
const outLinks = new Map(routes.map((r) => [r.route, 0]));
const broken = [];

for (const sourceFile of allSourceFiles) {
  const sourceContent = fs.readFileSync(sourceFile, 'utf8');
  const sourceRoute = pagePattern.test(path.basename(sourceFile)) ? routeFromPage(sourceFile) : null;
  let match;

  while ((match = hrefPattern.exec(sourceContent)) !== null) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('/#') || href.startsWith('//')) continue;

    const normalized = normalizeHref(href);
    if (sourceRoute) outLinks.set(sourceRoute, (outLinks.get(sourceRoute) || 0) + 1);

    if (routeSet.has(normalized)) {
      inLinks.set(normalized, (inLinks.get(normalized) || 0) + 1);
      continue;
    }

    const dynamicTarget = routes.find((r) => r.route.includes('[') && new RegExp(`^${r.route.replace(/\[[^/]+\]/g, '[^/]+')}$`).test(normalized));

    if (dynamicTarget) {
      inLinks.set(dynamicTarget.route, (inLinks.get(dynamicTarget.route) || 0) + 1);
    } else {
      broken.push({ from: path.relative(srcDir, sourceFile), href: normalized });
    }
  }
}

const indexableRoutes = routes.filter((r) => isIndexable(r.route)).map((r) => r.route);
const orphans = indexableRoutes.filter((route) => route !== '/' && (inLinks.get(route) || 0) === 0);
const highOutbound = [...outLinks.entries()].filter(([route, count]) => isIndexable(route) && count > 20).sort((a, b) => b[1] - a[1]);

const result = {
  generatedAt: new Date().toISOString(),
  totals: {
    allRoutes: routes.length,
    indexableRoutes: indexableRoutes.length,
    orphanIndexableRoutes: orphans.length,
    brokenInternalLinks: broken.length,
  },
  topNavigationCandidates: ['/salaries', '/companies', '/guides', '/tools', '/compare', '/analyze-offer'],
  orphanRoutes: orphans.sort(),
  highOutboundRoutes: highOutbound,
  brokenLinks: broken,
};

const outputPath = path.join(process.cwd(), 'docs', 'crawl-audit.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
console.log(`Wrote crawl audit to ${path.relative(process.cwd(), outputPath)}`);
console.log(JSON.stringify(result.totals, null, 2));
