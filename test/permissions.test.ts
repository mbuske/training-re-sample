import { describe, it, expect } from 'vitest';
import { hasPermission, permissionsForUser } from '../src/auth/permissions';
import type { User } from '../src/domain';

function user(roles: User['roles']): User {
  return { id: 'u', displayName: 'U', email: 'u@x.example', orgId: 'org-a', roles };
}

describe('permissions', () => {
  it('grants risk.export to risk_manager and auditor', () => {
    expect(hasPermission(user(['risk_manager']), 'risk.export')).toBe(true);
    expect(hasPermission(user(['auditor']), 'risk.export')).toBe(true);
  });

  it('denies risk.export to viewer but allows risk.read', () => {
    expect(hasPermission(user(['viewer']), 'risk.export')).toBe(false);
    expect(hasPermission(user(['viewer']), 'risk.read')).toBe(true);
  });

  it('unions permissions across multiple roles without duplicates', () => {
    const perms = permissionsForUser(user(['viewer', 'risk_manager']));
    expect(perms).toContain('risk.read');
    expect(perms).toContain('risk.export');
    expect(perms.filter((p) => p === 'risk.read')).toHaveLength(1);
  });
});
