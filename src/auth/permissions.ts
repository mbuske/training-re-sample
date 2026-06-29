import type { Permission, Role, User } from '../domain';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  risk_manager: ['risk.read', 'risk.export'],
  auditor: ['risk.read', 'risk.export'],
  // risk_owner may export, but "only own risks" scoping is the exercise.
  risk_owner: ['risk.read', 'risk.export'],
  viewer: ['risk.read'],
};

export function permissionsForUser(user: User): Permission[] {
  const set = new Set<Permission>();
  for (const role of user.roles) {
    for (const perm of ROLE_PERMISSIONS[role]) {
      set.add(perm);
    }
  }
  return [...set];
}

export function hasPermission(user: User, permission: Permission): boolean {
  return permissionsForUser(user).includes(permission);
}
