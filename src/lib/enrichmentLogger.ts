/**
 * Structured logging for the enrichment pipeline.
 *
 * Outputs JSON-structured log lines so they are easy to grep/parse
 * in production logging systems.
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface EnrichmentLogEntry {
  timestamp: string;
  level: LogLevel;
  event: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Emit a structured log line for enrichment operations.
 */
export function log(
  level: LogLevel,
  event: string,
  message: string,
  data?: Record<string, unknown>
): void {
  const entry: EnrichmentLogEntry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    message,
    data,
  };

  const prefix = `[enrichment:${event}]`;

  switch (level) {
    case 'error':
      console.error(prefix, message, data ? JSON.stringify(data) : '');
      break;
    case 'warn':
      console.warn(prefix, message, data ? JSON.stringify(data) : '');
      break;
    case 'debug':
      if (process.env.NODE_ENV !== 'production') {
        console.log(prefix, message, data ? JSON.stringify(data) : '');
      }
      break;
    default:
      console.log(prefix, message, data ? JSON.stringify(data) : '');
  }

  // In production, you could also write to an external logging service here.
  // For now, the structured entry is available if needed.
  void entry;
}
