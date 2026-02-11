export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Get the base URL for the application
 * Works in both development and production environments
 */
export function getBaseUrl(): string {
  // Check if running on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }

  // Check if there's a custom base URL set
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Fallback to localhost for development
  return "http://localhost:3000";
}

/**
 * Get the full URL for a given path
 * @param path - The path to append to the base URL (should start with /)
 */
export function getFullUrl(path: string): string {
  const base = getBaseUrl();
  return `${base}${path}`;
}

/**
 * Create a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing -
}

/**
 * Find the original string from a list of candidates that matches a slug
 */
export function findFromSlug(slug: string, candidates: string[]): string | undefined {
  return candidates.find(c => slugify(c) === slug);
}
