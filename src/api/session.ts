import { Router } from 'express';
import { permissionsForUser } from '../auth/permissions';

export const sessionRouter = Router();

sessionRouter.get('/', (req, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    displayName: user.displayName,
    orgId: user.orgId,
    roles: user.roles,
    permissions: permissionsForUser(user),
  });
});
