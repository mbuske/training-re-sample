interface PublicRisk {
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

interface Me {
  displayName: string;
  orgId: string;
  permissions: string[];
}

function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing element #${id}`);
  return node as T;
}

const userSelect = el<HTMLSelectElement>('user-select');
const statusFilter = el<HTMLSelectElement>('filter-status');
const categoryFilter = el<HTMLSelectElement>('filter-category');
const minScoreFilter = el<HTMLInputElement>('filter-minscore');
const tbody = el<HTMLTableSectionElement>('risk-tbody');
const statusLine = el<HTMLParagraphElement>('status-line');
const exportSlot = el<HTMLElement>('export-slot');
const exportHint = el<HTMLElement>('export-hint');

function currentUserId(): string {
  return userSelect.value;
}

async function loadMe(): Promise<void> {
  const res = await fetch('/api/me', { headers: { 'X-User-Id': currentUserId() } });
  if (!res.ok) {
    exportHint.textContent = '— Anmeldung fehlgeschlagen';
    return;
  }
  const me = (await res.json()) as Me;
  const canExport = me.permissions.includes('risk.export');
  exportSlot.classList.toggle('disabled', !canExport);
  exportHint.textContent = canExport
    ? '— hier entsteht der CSV-Export-Button (REQ-01)'
    : '— für diese Rolle nicht verfügbar (kein risk.export)';
}

async function loadRisks(): Promise<void> {
  const params = new URLSearchParams();
  if (statusFilter.value) params.set('status', statusFilter.value);
  if (categoryFilter.value) params.set('category', categoryFilter.value);
  if (minScoreFilter.value) params.set('minScore', minScoreFilter.value);

  const res = await fetch(`/api/risks?${params.toString()}`, {
    headers: { 'X-User-Id': currentUserId() },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    statusLine.textContent = `Fehler ${res.status}: ${body?.error?.message ?? 'unbekannt'}`;
    tbody.innerHTML = '';
    return;
  }

  const { risks } = (await res.json()) as { risks: PublicRisk[] };
  statusLine.textContent = `${risks.length} Risiken`;
  tbody.innerHTML = '';
  for (const r of risks) {
    const tr = document.createElement('tr');
    for (const cell of [
      r.id, r.title, r.category, r.status,
      String(r.probability), String(r.impact), String(r.score),
      r.ownerDisplayName, r.updatedAt,
    ]) {
      const td = document.createElement('td');
      td.textContent = cell; // textContent — no HTML injection from data
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

async function refresh(): Promise<void> {
  await loadMe();
  await loadRisks();
}

for (const control of [userSelect, statusFilter, categoryFilter]) {
  control.addEventListener('change', refresh);
}
minScoreFilter.addEventListener('input', loadRisks);

refresh();
