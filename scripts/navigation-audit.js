#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const appDir = path.join(root, "src", "app");
const sourceDir = path.join(root, "src");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else files.push(fullPath);
  }
  return files;
}

function routeFromPage(filePath) {
  const relative = path.relative(appDir, filePath).split(path.sep);
  const segments = relative.slice(0, -1).filter((segment) => !segment.startsWith("(") && segment !== "page.tsx");
  if (segments.length === 0) return "/";
  return `/${segments.join("/")}`;
}

const pageFiles = walk(appDir).filter((filePath) => /page\.(t|j)sx?$/.test(path.basename(filePath)));
const routes = pageFiles.map((filePath) => ({ route: routeFromPage(filePath), file: path.relative(root, filePath) }));
const routeSet = new Set(routes.map((route) => route.route));
const fileToRoute = new Map(routes.map((r) => [r.file, r.route]));

const sourceFiles = walk(sourceDir).filter((filePath) => /\.(t|j)sx?$/.test(filePath));
const hrefPattern = /href\s*=\s*["'`]([^"'`]+)["'`]/g;

const incoming = new Map();
const outgoing = new Map();
const graph = new Map();
for (const route of routeSet) {
  incoming.set(route, 0);
  outgoing.set(route, 0);
  graph.set(route, new Set());
}

const sharedLinks = new Set();
const brokenLinks = [];

for (const filePath of sourceFiles) {
  const rel = path.relative(root, filePath);
  const content = fs.readFileSync(filePath, "utf8");
  const sourceRoute = fileToRoute.get(rel) || "(shared)";

  let match;
  while ((match = hrefPattern.exec(content)) !== null) {
    const href = match[1];
    if (href.includes("${") || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/#")) continue;
    const normalized = (href.split(/[?#]/)[0].replace(/\/$/, "") || "/");

    if (sourceRoute !== "(shared)" && outgoing.has(sourceRoute)) {
      outgoing.set(sourceRoute, outgoing.get(sourceRoute) + 1);
    }

    if (routeSet.has(normalized)) {
      incoming.set(normalized, incoming.get(normalized) + 1);
      if (sourceRoute !== "(shared)") graph.get(sourceRoute).add(normalized);
      else sharedLinks.add(normalized);
    } else if (!normalized.includes("[") && !normalized.startsWith("/api")) {
      brokenLinks.push({ from: rel, href: normalized });
    }
  }
}

// apply shared links (header/footer components) as links from every route
for (const route of routeSet) {
  for (const linked of sharedLinks) {
    graph.get(route).add(linked);
  }
}

const depth = { "/": 0 };
const queue = ["/"];
while (queue.length) {
  const current = queue.shift();
  for (const next of graph.get(current) || []) {
    if (depth[next] == null) {
      depth[next] = depth[current] + 1;
      queue.push(next);
    }
  }
}

const unreachable = [...routeSet].filter((route) => depth[route] == null).sort();
const maxDepth = Object.values(depth).length ? Math.max(...Object.values(depth)) : 0;
const orphanRoutes = [...incoming.entries()].filter(([route, count]) => route !== "/" && count === 0).map(([route]) => route).sort();

console.log(JSON.stringify({
  totalRoutes: routes.length,
  maxClickDepthFromHome: maxDepth,
  unreachableRoutes: unreachable,
  orphanRoutes,
  highOutbound: [...outgoing.entries()].filter(([, c]) => c > 30).sort((a, b) => b[1] - a[1]),
  brokenLinks,
  routeInventory: routes,
}, null, 2));
