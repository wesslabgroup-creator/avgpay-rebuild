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
