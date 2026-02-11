"use client";

/**
 * Dev-only debug banner showing enrichment state for an entity.
 * Only renders when NODE_ENV !== 'production'.
 */

interface EnrichmentDebugBannerProps {
  entityType: string;
  entityName: string;
  enrichmentStatus: string;
  analysisExists: boolean;
  analysisKeys: string[];
  enrichedAt?: string | null;
}

export function EnrichmentDebugBanner({
  entityType,
  entityName,
  enrichmentStatus,
  analysisExists,
  analysisKeys,
  enrichedAt,
}: EnrichmentDebugBannerProps) {
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null;

  const statusColor = {
    completed: 'bg-green-100 text-green-800 border-green-300',
    complete: 'bg-green-100 text-green-800 border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    processing: 'bg-blue-100 text-blue-800 border-blue-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    none: 'bg-gray-100 text-gray-800 border-gray-300',
  }[enrichmentStatus] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div className={`rounded-lg border p-3 text-xs font-mono ${statusColor}`}>
      <div className="font-bold mb-1">[DEV] Enrichment Debug</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <span>entityType:</span><span>{entityType}</span>
        <span>entityName:</span><span className="truncate">{entityName}</span>
        <span>enrichmentStatus:</span><span className="font-semibold">{enrichmentStatus}</span>
        <span>analysis_json exists:</span><span>{analysisExists ? 'YES' : 'NO'}</span>
        <span>analysis keys:</span><span className="truncate">{analysisKeys.length > 0 ? analysisKeys.join(', ') : '(none)'}</span>
        <span>enrichedAt:</span><span>{enrichedAt || '(never)'}</span>
      </div>
    </div>
  );
}
