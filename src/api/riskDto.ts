import type { Risk } from '../domain';
import { findUser } from '../data/seed';

/** Risk shape safe to send to the client — allowlist-aligned, no sensitive fields. */
export interface PublicRisk {
  id: string;
  title: string;
  category: string;
  status: string;
  probability: number;
  impact: number;
  score: number;
  ownerDisplayName: string;
  createdAt: string;
  updatedAt: string;
}

export function toPublicRisk(risk: Risk): PublicRisk {
  const owner = findUser(risk.ownerId);
  return {
    id: risk.id,
    title: risk.title,
    category: risk.category,
    status: risk.status,
    probability: risk.probability,
    impact: risk.impact,
    score: risk.score,
    ownerDisplayName: owner?.displayName ?? 'Unbekannt',
    createdAt: risk.createdAt,
    updatedAt: risk.updatedAt,
  };
}
