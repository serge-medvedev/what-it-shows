import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { causeOf, groupByCause, uniqueById } from '../src/lib/kb/causes.ts';

const root = new URL('../', import.meta.url);
const load = async (path) => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const rows = await load('src/lib/data/reports-4471.json');
const tenants = await Promise.all((await readdir(new URL('src/lib/data/tenants/', root)))
  .filter((name) => name.endsWith('.json')).sort().map((name) => load(`src/lib/data/tenants/${name}`)));
const byHandle = new Map(tenants.map((t) => [t.handle, t]));
const tenantOf = (r) => byHandle.get(r.tenant);
const unique = uniqueById(rows);
const merged = unique.filter((r) => r.mergedInto === 4471);
const groups = groupByCause(merged, tenantOf);
const summary = {
  sourceTicket: 4471,
  rawRows: rows.length,
  uniqueReports: unique.length,
  repeatedRows: rows.length - unique.length,
  groups: groups.map((g) => ({ ...g, reports: g.reports.map((r) => r.id).sort() })),
  intakeDisagreements: merged.filter((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r))).map((r) => r.id).sort(),
  unresolvedBodies: (await load('src/lib/data/desk-notes.json')).oneDayMove,
};
await mkdir(new URL('evidence/', root), { recursive: true });
await writeFile(new URL('evidence/report-counts.json', root), JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify({ rawRows: rows.length, unique: unique.length, groups: groups.map((g) => [g.cause, g.reports.length]) }));
