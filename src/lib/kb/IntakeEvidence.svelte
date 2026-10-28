<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, groupByCause, causeOf, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const rows = reports as Report[];
  const unique = uniqueById(rows);
  const merged = unique.filter((r) => r.mergedInto === 4471);
  const groups = groupByCause(merged, tenantOf);
  const misTagged = merged.filter((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r)));
  const unusual = merged.filter((r) => notes.oneDayMove.includes(r.id));
  const batch = merged.filter((r) => r.mergedAt?.startsWith('2026-07-02'));
  const older = batch.filter((r) => r.receivedAt.slice(0, 10) < '2026-07-02');
</script>

<p>The export has <strong>{rows.length}</strong> rows and <strong>{unique.length}</strong> unique report IDs;
  <strong>{rows.length - unique.length}</strong> repeated rows must not inflate the counts.
  All <strong>{merged.length}</strong> unique reports are merged into #4471.
  Tenant and channel routing disagrees with intake tags on <strong>{misTagged.length}</strong> reports.</p>

<table>
  <thead><tr><th>Cause</th><th>Affected tenants</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      <tr><td>{g.cause}</td><td>{[...new Set(g.reports.map((r) => r.tenant))].sort().join(', ')}</td></tr>
    {/each}
  </tbody>
</table>

<p>On 2026-07-02 the desk merged <strong>{batch.length}</strong> reports,
  of which <strong>{older.length}</strong> had arrived before that day.
  The merge spike is a backlog being filed; it is not the onset of a new incident.
  The chart below separates when customers reported a problem from when the desk merged it.</p>

<h3>Unresolved report bodies</h3>
<p>The tenant-based classifier assigns these <strong>{unusual.length}</strong> reports to parser.
  Their bodies do not establish a month/day swap. Preserve them in the routed count while investigating;
  do not claim that the parser fix explains them or invent a confirmed third cause.</p>
<ul>
  {#each unusual as r (r.id)}
    <li><strong>{r.id}</strong> · {r.tenant} · {r.channel}: “{r.body}”</li>
  {/each}
</ul>
<p>Ask for the original input, parsed timestamp, calendar event timezone and delivered invite for each.
  In particular, compare the Lisbon and Toronto display of the same meeting in R-41344.
  Split a further issue only when that evidence establishes a different failure.</p>
