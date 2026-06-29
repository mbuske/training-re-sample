import { describe, it, expect } from 'vitest';
import { organizations, users, risks, findUser } from '../src/data/seed';

describe('seed integrity', () => {
  it('has two organizations and four users covering all roles', () => {
    expect(organizations.map((o) => o.id).sort()).toEqual(['org-a', 'org-b']);
    const roles = new Set(users.flatMap((u) => u.roles));
    expect([...roles].sort()).toEqual(['auditor', 'risk_manager', 'risk_owner', 'viewer']);
  });

  it('splits risks 9 (org-a) / 6 (org-b)', () => {
    expect(risks.filter((r) => r.orgId === 'org-a')).toHaveLength(9);
    expect(risks.filter((r) => r.orgId === 'org-b')).toHaveLength(6);
  });

  it('includes exactly one CSV-injection title as an exercise target', () => {
    const dangerous = risks.filter((r) => /^[=+\-@]/.test(r.title));
    expect(dangerous).toHaveLength(1);
  });

  it('keeps a sensitive internalNotes value on every risk', () => {
    expect(risks.every((r) => r.internalNotes.trim().length > 0)).toBe(true);
  });

  it('computes score as probability * impact', () => {
    expect(risks.every((r) => r.score === r.probability * r.impact)).toBe(true);
  });

  it('owns every risk by a user in the same organization', () => {
    for (const r of risks) {
      const owner = findUser(r.ownerId);
      expect(owner, `owner for ${r.id}`).toBeDefined();
      expect(owner!.orgId).toBe(r.orgId);
    }
  });
});
