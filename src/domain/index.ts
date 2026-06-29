export type Role = 'risk_manager' | 'risk_owner' | 'auditor' | 'viewer';

export type Permission = 'risk.read' | 'risk.export';

export type RiskCategory = 'Operational' | 'Security' | 'Financial' | 'Compliance';

export type RiskStatus = 'open' | 'mitigated' | 'accepted' | 'closed';

export interface Organization {
  id: string;
  name: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;        // sensitive — must NOT be exported
  orgId: string;        // tenant; server-side source of truth
  roles: Role[];
}

export interface Risk {
  id: string;           // e.g. "R-1001" — allowed (Risk ID)
  orgId: string;        // tenant
  title: string;
  category: RiskCategory;
  status: RiskStatus;
  probability: number;  // 1..5
  impact: number;       // 1..5
  score: number;        // probability * impact — filterable (minScore)
  ownerId: string;      // -> ownerDisplayName allowed, ownerEmail NOT
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
  internalNotes: string; // sensitive — NOT in the allowlist
}

/**
 * Fields the CSV export is ALLOWED to include (from the Agent-PRD).
 * Documented here on purpose — the export exercise will consume this.
 * Nothing in this base serializes it.
 */
export const EXPORT_FIELD_ALLOWLIST: readonly string[] = [
  'Risk ID',
  'Title',
  'Category',
  'Status',
  'Probability',
  'Impact',
  'Risk score',
  'Owner display name',
  'Created date',
  'Updated date',
];
