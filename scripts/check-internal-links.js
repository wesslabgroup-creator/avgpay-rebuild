#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const appDir = path.join(repoRoot, 'src', 'app');
const guidesDir = path.join(appDir, 'guides');

const PAGE_FILE_PATTERN = /^page\.(t|j)sx?$/;
const LINK_PATTERN = /href\s*=\s*"([^"]+)"/g;
const EXEMPT_ROUTES = new Set([
  '/terms', // TODO: add src/app/terms/page.tsx and remove this exemption.
]);

function walk(dir, collected = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, collected);
      continue;
    }

    collected.push(fullPath);
  }

  return collected;
}

function toRouteFromPageFile(filePath) {
  const relativePath = path.relative(appDir, filePath).split(path.sep).join('/');
  const segments = relativePath.split('/').slice(0, -1).filter((segment) => !segment.startsWith('('));

  if (segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function shouldCheckLink(href) {
  if (!href.startsWith('/')) return false;
  if (href.startsWith('//')) return false;
  if (href.startsWith('/#')) return false;

  return true;
}

function normalizeHref(href) {
  const [withoutQuery] = href.split('?');
  const [withoutHash] = withoutQuery.split('#');

  if (withoutHash.length > 1 && withoutHash.endsWith('/')) {
    return withoutHash.slice(0, -1);
  }

  return withoutHash || '/';
}

const pageFiles = walk(appDir).filter((filePath) => PAGE_FILE_PATTERN.test(path.basename(filePath)));
const knownRoutes = new Set(pageFiles.map(toRouteFromPageFile));

const guidePageFiles = walk(guidesDir).filter((filePath) => filePath.endsWith('page.tsx'));
const missingLinks = [];

for (const filePath of guidePageFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  let match;

  while ((match = LINK_PATTERN.exec(content)) !== null) {
    const href = match[1];

    if (!shouldCheckLink(href)) {
      continue;
    }

    const normalizedHref = normalizeHref(href);

    if (EXEMPT_ROUTES.has(normalizedHref)) {
      continue;
    }

    if (!knownRoutes.has(normalizedHref)) {
      missingLinks.push({ filePath, href: normalizedHref });
    }
  }
}

if (missingLinks.length > 0) {
  console.error('Missing internal routes found in guide pages:');
  for (const { filePath, href } of missingLinks) {
    console.error(`- ${path.relative(repoRoot, filePath)} -> ${href}`);
  }
  process.exit(1);
}

console.log(`Guide internal link check passed (${guidePageFiles.length} files scanned).`);
