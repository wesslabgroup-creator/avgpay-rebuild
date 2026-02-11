/**
 * Entity name normalization utilities.
 *
 * Produces a stable, deduplicated key for each entity so that
 * "Google ", " google", and "GOOGLE" all resolve to the same record.
 */

import type { EntityType } from './enrichment';

// ============================================================
// Core normalization
// ============================================================

/**
 * Normalize a raw entity name for deduplication:
 * - trim whitespace
 * - collapse multiple spaces
 * - lowercase
 */
export function normalizeEntityName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Normalize a city string to "city, ST" format.
 * Handles inputs like "Austin,TX", "austin , tx", " Austin,  TX ".
 */
export function normalizeCityName(raw: string): { displayName: string; keyName: string } {
  const parts = raw.split(',').map(p => p.trim());
  const city = parts[0] || '';
  const state = (parts[1] || '').toUpperCase();

  // Display name: "Austin, TX"
  const displayCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  const displayName = state ? `${displayCity}, ${state}` : displayCity;

  // Key name: "austin-tx" (slug-style, no commas)
  const keyName = normalizeEntityName(displayName)
    .replace(/,/g, '')
    .replace(/\s+/g, '-');

  return { displayName, keyName };
}

/**
 * Build a unique entity key used for queue deduplication.
 * Format: "EntityType:normalized-name"
 *
 * Examples:
 *   buildEntityKey('Company', 'Google') → 'Company:google'
 *   buildEntityKey('City', 'Austin, TX') → 'City:austin-tx'
 *   buildEntityKey('Job', 'Software Engineer') → 'Job:software-engineer'
 */
export function buildEntityKey(entityType: EntityType, entityName: string): string {
  const normalized = normalizeEntityName(entityName)
    .replace(/,/g, '')
    .replace(/\s+/g, '-');
  return `${entityType}:${normalized}`;
}

/**
 * Normalize a company name for display and key purposes.
 */
export function normalizeCompanyName(raw: string): { displayName: string; keyName: string } {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  return {
    displayName: trimmed,
    keyName: normalizeEntityName(trimmed).replace(/\s+/g, '-'),
  };
}

/**
 * Normalize a job title for display and key purposes.
 */
export function normalizeJobTitle(raw: string): { displayName: string; keyName: string } {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  return {
    displayName: trimmed,
    keyName: normalizeEntityName(trimmed).replace(/\s+/g, '-'),
  };
}
