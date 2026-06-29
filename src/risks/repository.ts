import type { Risk } from '../domain';
import { risks as seedRisks } from '../data/seed';
import { applyFilters, type RiskFilter } from './filters';

/**
 * Loads risks for a single organization, then applies the filter.
 * The tenant scope is derived from `orgId` (server-side), never from client input.
 */
export function listRisks(orgId: string, filter: RiskFilter, source: Risk[] = seedRisks): Risk[] {
  const scoped = source.filter((r) => r.orgId === orgId);
  return applyFilters(scoped, filter);
}
