import type { NextFunction, Request, Response } from 'express';
import type { Permission } from '../domain';
import { HttpError } from '../lib/httpError';
import { findUser } from '../data/seed';
import { hasPermission } from './permissions';

/**
 * DEV-ONLY auth: resolves the X-User-Id header to a seeded user.
 * The whole point: org and permissions come from the resolved user
 * (server-side), never from client-supplied parameters.
 */
export function devAuth(req: Request, _res: Response, next: NextFunction): void {
  const id = req.header('X-User-Id');
  if (!id) {
    next(new HttpError(401, 'unauthenticated', 'Missing X-User-Id header'));
    return;
  }
  const user = findUser(id);
  if (!user) {
    next(new HttpError(401, 'unauthenticated', `Unknown user: ${id}`));
    return;
  }
  req.user = user;
  next();
}

export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new HttpError(401, 'unauthenticated', 'No authenticated user'));
      return;
    }
    if (!hasPermission(req.user, permission)) {
      next(new HttpError(403, 'forbidden', `Missing permission: ${permission}`));
      return;
    }
    next();
  };
}
