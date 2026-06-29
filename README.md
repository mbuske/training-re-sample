# training-re-sample

Base codebase for the **AgenticRE** training example **„Baue eine Exportfunktion
für Risiken als CSV."** (`FEAT-RISK-EXPORT-CSV`). This repo is intentionally in the
state *before* the export — participants build the export feature on top of it
using an agentic AI workflow.

A small, runnable TypeScript/Express fullstack app: a multi-tenant risk register
with roles, permissions, a filterable risk list, and a minimal web UI. Everything
the CSV export needs is here as a hook; the export itself is not — that's the exercise.

## Quick start

```bash
git clone https://github.com/mbuske/training-re-sample.git
cd training-re-sample
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm test         # Vitest suite (33 tests)
npm run build    # typecheck server + emit the frontend bundle
npm start        # run the server (builds the frontend first via prestart)
```

> Requires Node.js 20+.

## The training example

The whole AgenticRE session threads one running feature — `FEAT-RISK-EXPORT-CSV`:
authorized users export a *filtered* list of risks as CSV, while the system
preserves tenant boundaries, checks permissions **server-side**, restricts output
to an approved field allowlist, writes an audit-log entry, and neutralizes
CSV-injection. This repo gives participants a realistic, honest starting point so
they can implement that feature for real — not on a toy.

The full requirement (spec, PRD, tasks, tests) lives in the companion training repo
under `AgenticRE_01_LiveDemo_AgentSpec/.../03_demo_artifacts/`.

## Tech stack

- **TypeScript (ESM)** + **Express 4** — one process serves the JSON API *and* the
  static frontend.
- **In-memory seed data** — no database; deterministic, runs anywhere.
- **Dev-auth** — no real login: an `X-User-Id` header resolves to a seeded user;
  the server derives org + permissions from that user (never from client input).
- **Vitest** + **supertest** for tests. **tsx** runs the server (no compile-to-dist).
- **No frontend bundler** — one static page; `public/app.ts` is compiled to
  `public/app.js` by `tsc`.

## Project layout

```
src/
  domain/        types + constants (Risk, User, Organization, roles, EXPORT_FIELD_ALLOWLIST)
  data/seed.ts   in-memory data: 2 orgs, 4 users, 15 risks
  auth/          devAuth.ts (X-User-Id → user) + permissions.ts (role→permission map)
  risks/         filters.ts (validate + filter) + repository.ts (tenant-scoped query)
  api/           session.ts (GET /api/me), risks.ts (GET /api/risks), riskDto.ts
  audit/         auditLog.ts — append-only sink (unused hook for the export)
  lib/           httpError.ts — { error: { code, message } } error model
  server.ts      createApp(): wires middleware, routers, static, error handler
public/          index.html, app.ts, styles.css  (the risk-list page)
test/            Vitest suites (one per module + an API integration suite)
```

## API

All `/api` routes require an `X-User-Id` header (dev-auth). Errors use a uniform
shape: `{ "error": { "code": "...", "message": "..." } }`.

| Method & path | Auth | Returns |
|---|---|---|
| `GET /api/me` | any seeded user | the current user + derived `permissions` |
| `GET /api/risks?status=&category=&minScore=` | `risk.read` | tenant-scoped, server-side-filtered risks (sensitive fields stripped) |

Try it from the command line:

```bash
# Risk Manager of org-a — sees 9 risks, has risk.export permission
curl -H "X-User-Id: u-anna" http://localhost:3000/api/risks?status=open

# Viewer — allowed to read, but /api/me shows no risk.export
curl -H "X-User-Id: u-max" http://localhost:3000/api/me
```

## Seeded users (for trying roles & tenants)

Switch the acting user with the dropdown in the UI, or set the `X-User-Id` header
directly. Org and permissions are resolved **server-side** from the user.

| `X-User-Id` | Name | Role | Org | `risk.export`? |
|---|---|---|---|---|
| `u-anna` | Anna Becker | risk_manager | Nordwind AG (org-a) | ✅ |
| `u-tom`  | Tom Vogel   | risk_owner   | Nordwind AG (org-a) | ✅ |
| `u-max`  | Max Frey    | viewer       | Nordwind AG (org-a) | ❌ |
| `u-sara` | Sara Klein  | auditor      | Südstern GmbH (org-b) | ✅ |

Org-a holds 9 risks, org-b holds 6 — a Manager from org-a can never see org-b's
risks, which is what makes the tenant-boundary requirement testable.

## What already exists

- **Domain model** (`src/domain`) — `Risk`, `User`, `Organization`, roles, permissions.
- **Seed data** (`src/data/seed.ts`) — Nordwind AG (org-a, 9 risks) and Südstern GmbH
  (org-b, 6 risks); four users covering all roles; one risk carries a deliberate
  CSV-injection title (`R-1003`); every risk has sensitive `internalNotes`.
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
