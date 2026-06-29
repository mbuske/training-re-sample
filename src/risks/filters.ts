import type { Risk, RiskCategory, RiskStatus } from '../domain';
import { HttpError } from '../lib/httpError';

export interface RiskFilter {
  status?: RiskStatus;
  category?: RiskCategory;
  minScore?: number;
}

const STATUSES: RiskStatus[] = ['open', 'mitigated', 'accepted', 'closed'];
const CATEGORIES: RiskCategory[] = ['Operational', 'Security', 'Financial', 'Compliance'];

export function parseRiskFilter(query: Record<string, unknown>): RiskFilter {
  const filter: RiskFilter = {};

  if (query.status !== undefined) {
    const value = String(query.status);
    if (!STATUSES.includes(value as RiskStatus)) {
      throw new HttpError(400, 'invalid_filter', `Unknown status: ${value}`);
    }
    filter.status = value as RiskStatus;
  }

  if (query.category !== undefined) {
    const value = String(query.category);
    if (!CATEGORIES.includes(value as RiskCategory)) {
      throw new HttpError(400, 'invalid_filter', `Unknown category: ${value}`);
    }
    filter.category = value as RiskCategory;
  }

  if (query.minScore !== undefined) {
    const value = Number(query.minScore);
    if (!Number.isFinite(value) || value < 0) {
      throw new HttpError(400, 'invalid_filter', `Invalid minScore: ${String(query.minScore)}`);
    }
    filter.minScore = value;
  }

  return filter;
}

export function applyFilters(items: Risk[], filter: RiskFilter): Risk[] {
  return items.filter(
    (r) =>
      (filter.status === undefined || r.status === filter.status) &&
      (filter.category === undefined || r.category === filter.category) &&
      (filter.minScore === undefined || r.score >= filter.minScore),
  );
}
