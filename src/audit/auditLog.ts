export interface AuditEntry {
  userId: string;
  orgId: string;
  timestamp: string;     // ISO
  action: string;
  filterSummary: string;
  rowCount: number;
}

const entries: AuditEntry[] = [];

/**
 * Append-only audit sink.
 * NOTE: the CSV-export exercise (REQ-06) will call this after a successful
 * export. Nothing in this base calls it yet — that is intentional.
 */
export function recordAudit(entry: AuditEntry): void {
  entries.push(entry);
}

export function getAuditEntries(): readonly AuditEntry[] {
  return entries;
}
