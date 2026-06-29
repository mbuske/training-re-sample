import { describe, it, expect } from 'vitest';
import { parseRiskFilter, applyFilters } from '../src/risks/filters';
import { listRisks } from '../src/risks/repository';
import { HttpError } from '../src/lib/httpError';
import type { Risk } from '../src/domain';

const sample: Risk[] = [
  { id: 'A1', orgId: 'org-a', title: 'a', category: 'Operational', status: 'open', probability: 4, impact: 5, score: 20, ownerId: 'u-tom', createdAt: '2026-01-01', updatedAt: '2026-01-02', internalNotes: 'x' },
  { id: 'A2', orgId: 'org-a', title: 'b', category: 'Security', status: 'closed', probability: 1, impact: 2, score: 2, ownerId: 'u-tom', createdAt: '2026-01-01', updatedAt: '2026-01-02', internalNotes: 'x' },
  { id: 'B1', orgId: 'org-b', title: 'c', category: 'Operational', status: 'open', probability: 3, impact: 4, score: 12, ownerId: 'u-sara', createdAt: '2026-01-01', updatedAt: '2026-01-02', internalNotes: 'x' },
];

describe('parseRiskFilter', () => {
  it('parses valid status, category and minScore', () => {
    const f = parseRiskFilter({ status: 'open', category: 'Operational', minScore: '10' });
    expect(f).toEqual({ status: 'open', category: 'Operational', minScore: 10 });
  });

  it('ignores absent params', () => {
    expect(parseRiskFilter({})).toEqual({});
  });

  it('throws 400 on an unknown status', () => {
    try {
      parseRiskFilter({ status: 'banana' });
      throw new Error('should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpError);
      expect((e as HttpError).status).toBe(400);
      expect((e as HttpError).code).toBe('invalid_filter');
    }
  });

  it('throws 400 on a negative minScore', () => {
    expect(() => parseRiskFilter({ minScore: '-1' })).toThrow(HttpError);
  });
});

describe('applyFilters', () => {
  it('filters by minScore', () => {
    expect(applyFilters(sample, { minScore: 10 }).map((r) => r.id)).toEqual(['A1', 'B1']);
  });
});

describe('listRisks (tenant scope)', () => {
  it('returns only the requested org', () => {
    const rows = listRisks('org-a', {}, sample);
    expect(rows.map((r) => r.id)).toEqual(['A1', 'A2']);
    expect(rows.some((r) => r.orgId === 'org-b')).toBe(false);
  });

  it('applies filters within the org scope', () => {
    const rows = listRisks('org-a', { status: 'open' }, sample);
    expect(rows.map((r) => r.id)).toEqual(['A1']);
  });
});
