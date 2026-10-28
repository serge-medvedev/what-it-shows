<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import update from '#lib/data/engineering-4471.json';
  import { groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  const groups = groupByCause(uniqueById(reports as Report[]).filter((r) => r.mergedInto === update.ticket), tenantOf);
  const outcomes = { parser: update.parser, hint: update.hint };
</script>

<p>The desk closed #{update.ticket} on {update.closed}.
  Source: <a href={update.source}>course engineering update</a>.</p>
<table>
  <thead><tr><th>Cause</th><th>Reports</th><th>Engineering outcome</th><th>Evidence</th><th>GitHub closure</th></tr></thead>
  <tbody>
    {#each groups as g (g.cause)}
      {@const result = g.cause === 'unplaced' ? null : outcomes[g.cause]}
      <tr>
        <td>{g.cause}</td><td>{g.reports.length}</td>
        <td>{result?.outcome ?? 'unresolved'}</td><td>{result?.detail ?? 'investigate'}</td>
        <td>{#if result}<a href={`https://github.com/serge-medvedev/what-it-shows/issues/${result.issue}`}>#{result.issue}</a> · {result.closeReason}{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>
