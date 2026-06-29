# training-re-sample

Base codebase for the AgenticRE training example **„Baue eine Exportfunktion für
Risiken als CSV."** (`FEAT-RISK-EXPORT-CSV`). This repo is intentionally in the
state *before* the export — participants build the export feature on top of it.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest suite
npm run build    # typecheck server + emit frontend
```

Switch the acting user (role + organization) with the dropdown on the page. It
only sets the `X-User-Id` header; the server resolves org and permissions from
the seeded user.

## What already exists

- **Domain model** (`src/domain`) — `Risk`, `User`, `Organization`, roles, permissions.
- **Seed data** (`src/data/seed.ts`) — Nordwind AG (org-a, 9 risks) and Südstern GmbH
  (org-b, 6 risks); four users covering all roles; one risk carries a deliberate
  CSV-injection title; every risk has sensitive `internalNotes`.
- **Permissions** (`src/auth/permissions.ts`) — role→permission map incl. `risk.export`.
- **Dev-auth** (`src/auth/devAuth.ts`) — `X-User-Id` → seeded user; `requirePermission`.
- **Risk querying** (`src/risks`) — server-side filters + tenant-scoped repository.
- **API** (`src/api`) — `GET /api/me`, `GET /api/risks` (filterable, sensitive fields stripped).
- **Frontend** (`public/`) — user switch, filters, risk table, marked empty export slot.

## What the exercise builds (deliberately absent)

Everything `FEAT-RISK-EXPORT-CSV` requires that is **not** here yet:

- `GET /api/risks/export` (the CSV endpoint)
- Field allowlist → CSV serialization (`EXPORT_FIELD_ALLOWLIST` is documented in
  `src/domain`, but nothing serializes it)
- CSV-injection neutralization (`=`, `+`, `-`, `@`) — `R-1003` is a ready target
- Audit-log entry on export (`src/audit/auditLog.ts` is a sink nothing calls yet)
- The export button + error states in the frontend (the slot is marked)

The full requirement lives in the training repo:
`AgenticRE_01_LiveDemo_AgentSpec/.../03_demo_artifacts/04_spec.md`.
