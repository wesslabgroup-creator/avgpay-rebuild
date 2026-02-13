export const TRACKING_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'ref',
];

export function normalizePathname(pathname: string): string {
  if (!pathname) return '/';
  const collapsed = pathname.replace(/\/+/g, '/');
  if (collapsed.length > 1 && collapsed.endsWith('/')) {
    return collapsed.slice(0, -1);
  }
  return collapsed;
}

export function stripTrackingParams(url: URL): boolean {
  let changed = false;
  for (const key of TRACKING_PARAMS) {
    if (url.searchParams.has(key)) {
      url.searchParams.delete(key);
      changed = true;
    }
  }
  return changed;
}

export function buildCanonicalUrl(pathname: string): string {
  const normalized = normalizePathname(pathname);
  return `https://avgpay.com${normalized === '/' ? '' : normalized}`;
}
