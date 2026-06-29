import { describe, it, expect } from 'vitest';
import { recordAudit, getAuditEntries } from '../src/audit/auditLog';

describe('audit sink', () => {
  it('appends and exposes entries', () => {
    const before = getAuditEntries().length;
    recordAudit({
      userId: 'u-anna', orgId: 'org-a', timestamp: '2026-06-29T10:00:00.000Z',
      action: 'risk.export', filterSummary: 'status=open', rowCount: 3,
    });
    const after = getAuditEntries();
    expect(after.length).toBe(before + 1);
    expect(after[after.length - 1].rowCount).toBe(3);
  });
});
