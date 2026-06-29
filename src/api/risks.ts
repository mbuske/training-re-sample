import { Router } from 'express';
import { requirePermission } from '../auth/devAuth';
import { parseRiskFilter } from '../risks/filters';
import { listRisks } from '../risks/repository';
import { toPublicRisk } from './riskDto';

export const risksRouter = Router();

// NOTE: there is deliberately NO export route here.
// Building GET /api/risks/export is the training exercise (FEAT-RISK-EXPORT-CSV).
risksRouter.get('/', requirePermission('risk.read'), (req, res) => {
  const filter = parseRiskFilter(req.query as Record<string, unknown>);
  const rows = listRisks(req.user!.orgId, filter);
  res.json({ risks: rows.map(toPublicRisk) });
});
