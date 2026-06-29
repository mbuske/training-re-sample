# training-re-sample

*Read this in [English](README.md).*

Basis-Codebasis für das **AgenticRE**-Trainingsbeispiel **„Baue eine Exportfunktion
für Risiken als CSV."** (`FEAT-RISK-EXPORT-CSV`). Dieses Repo ist bewusst im Zustand
*vor* dem Export — Teilnehmende bauen die Exportfunktion mit einem agentischen
KI-Workflow darauf auf.

Eine kleine, lauffähige TypeScript/Express-Fullstack-App: ein mandantenfähiges
Risikoregister mit Rollen, Berechtigungen, einer filterbaren Risiko-Liste und
einer minimalen Web-UI. Alles, was der CSV-Export benötigt, ist als Hook bereits
vorhanden; der Export selbst ist es nicht — das ist die Übung.

## Schnellstart

```bash
git clone https://github.com/mbuske/training-re-sample.git
cd training-re-sample
npm install
npm run dev      # http://localhost:3000
```

Weitere Skripte:

```bash
npm test         # Vitest-Suite (33 Tests)
npm run build    # Typecheck Server + Frontend-Bundle erzeugen
npm start        # Server starten (baut vorab das Frontend via prestart)
```

> Benötigt Node.js 20+.

## Das Trainingsbeispiel

Die gesamte AgenticRE-Session zieht ein durchgängiges Feature durch —
`FEAT-RISK-EXPORT-CSV`: Berechtigte Nutzer:innen exportieren eine *gefilterte*
Risiko-Liste als CSV, während das System Mandantengrenzen wahrt, Berechtigungen
**serverseitig** prüft, die Ausgabe auf eine freigegebene Feld-Allowlist
beschränkt, einen Audit-Log-Eintrag schreibt und CSV-Injection neutralisiert.
Dieses Repo liefert einen realistischen, ehrlichen Ausgangspunkt — kein
Spielzeug —, damit die Teilnehmenden das Feature echt umsetzen können.

Die vollständige Anforderung (Spec, PRD, Tasks, Tests) liegt im begleitenden
Trainings-Repo unter `AgenticRE_01_LiveDemo_AgentSpec/.../03_demo_artifacts/`.

## Agentisches Tooling

Die Live-Demo nutzt **[opencode](https://opencode.ai)** als CLI-Harness für den
agentischen Workflow. Installation per:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Weitere Installationsvarianten (npm, brew, paru) sind auf <https://opencode.ai>
dokumentiert.

Ergänzend kommt **[Superpowers](https://github.com/obra/superpowers)** zum
Einsatz — ein Skills-Framework, das wiederverwendbare Vorgehensweisen
(Brainstorming, TDD, systematisches Debugging, Plan-Erstellung & -Ausführung
etc.) als aufrufbare Skills bereitstellt und so die Agenten-Sessions
strukturiert. Das Plugin wird über `opencode.json` geladen.

## Tech-Stack

- **TypeScript (ESM)** + **Express 4** — ein Prozess liefert sowohl die JSON-API
  *als auch* das statische Frontend aus.
- **In-Memory-Seed-Daten** — keine Datenbank; deterministisch, läuft überall.
- **Dev-Auth** — kein echter Login: ein `X-User-Id`-Header wird auf einen
  seedeten User aufgelöst; der Server leitet Organisation + Berechtigungen
  serverseitig aus diesem User ab (nie aus Client-Input).
- **Vitest** + **supertest** für Tests. **tsx** führt den Server aus (kein
  Compile-to-dist).
- **Kein Frontend-Bundler** — eine statische Seite; `public/app.ts` wird per
  `tsc` zu `public/app.js` kompiliert.

## Projektstruktur

```
src/
  domain/        Typen + Konstanten (Risk, User, Organization, Rollen, EXPORT_FIELD_ALLOWLIST)
  data/seed.ts   In-Memory-Daten: 2 Organisationen, 4 User, 15 Risiken
  auth/          devAuth.ts (X-User-Id → User) + permissions.ts (Rolle→Berechtigung-Map)
  risks/         filters.ts (Validierung + Filter) + repository.ts (mandantengescopte Query)
  api/           session.ts (GET /api/me), risks.ts (GET /api/risks), riskDto.ts
  audit/         auditLog.ts — Append-only-Sink (ungenutzter Hook für den Export)
  lib/           httpError.ts — { error: { code, message } }-Fehlermodell
  server.ts      createApp(): verdrahtet Middleware, Router, Static, Error-Handler
public/          index.html, app.ts, styles.css  (die Risiko-Listen-Seite)
test/            Vitest-Suiten (eine pro Modul + eine API-Integrations-Suite)
```

## API

Alle `/api`-Routen erfordern einen `X-User-Id`-Header (Dev-Auth). Fehler nutzen
ein einheitliches Format: `{ "error": { "code": "...", "message": "..." } }`.

| Methode & Pfad | Auth | Liefert |
|---|---|---|
| `GET /api/me` | beliebiger seedeter User | aktueller User + abgeleitete `permissions` |
| `GET /api/risks?status=&category=&minScore=` | `risk.read` | mandantengescopte, serverseitig gefilterte Risiken (sensitive Felder entfernt) |

Aufruf über die Kommandozeile:

```bash
# Risk Manager aus org-a — sieht 9 Risiken, hat risk.export-Berechtigung
curl -H "X-User-Id: u-anna" http://localhost:3000/api/risks?status=open

# Viewer — darf lesen, aber /api/me zeigt keine risk.export-Berechtigung
curl -H "X-User-Id: u-max" http://localhost:3000/api/me
```

## Seedete User (zum Ausprobieren von Rollen & Mandanten)

Den aktiven User über das Dropdown in der UI wechseln oder den `X-User-Id`-Header
direkt setzen. Organisation und Berechtigungen werden **serverseitig** aus dem
User aufgelöst.

| `X-User-Id` | Name | Rolle | Organisation | `risk.export`? |
|---|---|---|---|---|
| `u-anna` | Anna Becker | risk_manager | Nordwind AG (org-a) | ✅ |
| `u-tom`  | Tom Vogel   | risk_owner   | Nordwind AG (org-a) | ✅ |
| `u-max`  | Max Frey    | viewer       | Nordwind AG (org-a) | ❌ |
| `u-sara` | Sara Klein  | auditor      | Südstern GmbH (org-b) | ✅ |

Org-a enthält 9 Risiken, org-b enthält 6 — ein Manager aus org-a sieht niemals
Risiken aus org-b. Genau das macht die Mandantengrenze testbar.

## Was bereits existiert

- **Domain-Modell** (`src/domain`) — `Risk`, `User`, `Organization`, Rollen,
  Berechtigungen.
- **Seed-Daten** (`src/data/seed.ts`) — Nordwind AG (org-a, 9 Risiken) und
  Südstern GmbH (org-b, 6 Risiken); vier User, die alle Rollen abdecken; ein
  Risiko trägt einen bewusst CSV-Injection-trächtigen Titel (`R-1003`); jedes
  Risiko hat sensitive `internalNotes`.
- **Berechtigungen** (`src/auth/permissions.ts`) — Rolle→Berechtigung-Map inkl.
  `risk.export`.
- **Dev-Auth** (`src/auth/devAuth.ts`) — `X-User-Id` → seedeter User;
  `requirePermission`.
- **Risiko-Abfrage** (`src/risks`) — serverseitige Filter + mandantengescoptes
  Repository.
- **API** (`src/api`) — `GET /api/me`, `GET /api/risks` (filterbar, sensitive
  Felder entfernt).
- **Frontend** (`public/`) — User-Switch, Filter, Risiko-Tabelle, markierter
  leerer Export-Slot.

## Was die Übung baut (bewusst nicht enthalten)

Alles, was `FEAT-RISK-EXPORT-CSV` benötigt und **noch nicht** vorhanden ist:

- `GET /api/risks/export` (der CSV-Endpoint)
- Feld-Allowlist → CSV-Serialisierung (`EXPORT_FIELD_ALLOWLIST` ist in
  `src/domain` dokumentiert, aber nichts serialisiert sie)
- CSV-Injection-Neutralisierung (`=`, `+`, `-`, `@`) — `R-1003` ist ein
  vorbereitetes Ziel
- Audit-Log-Eintrag beim Export (`src/audit/auditLog.ts` ist eine Sink, die
  noch von niemandem aufgerufen wird)
- Der Export-Button + Fehlerzustände im Frontend (der Slot ist markiert)
