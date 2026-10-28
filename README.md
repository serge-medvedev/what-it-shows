# kb — the support knowledge base

## S01E03 delivery

The new signed decision is [`src/routes/kb/decisions/0002-triage-by-cause/+page.svx`](src/routes/kb/decisions/0002-triage-by-cause/+page.svx).
Open [`rendered/0002-triage-by-cause.html`](rendered/0002-triage-by-cause.html) for the rendered page,
or view [`rendered/0002-triage-by-cause.png`](rendered/0002-triage-by-cause.png) on GitHub.
The HTML snapshots include inline styles and relative links between the exported pages. Their
controls are disabled because they are snapshots; the running KB has the interactive explorer.

Reproduce with Node.js 22.18 or later:

```sh
npm ci --ignore-scripts
node scripts/analyze.mjs
npm run dev
```

Open `/kb/decisions/0002-triage-by-cause` on the printed local address. For a production build,
run `npm run build`, then `npm run preview`. The included Vite wrapper compiles the exported
Svelte and mdsvex files with the `#lib` alias and runbook layout.

`evidence/report-counts.json` records the unique IDs in each cause bucket using the exported
`causes.ts` logic and tenant directory. The two GitHub issue drafts are in `tickets/parser.txt`
and `tickets/hint.txt`. Original report and tenant data, shared cause logic, and accepted
decision 0001 are unchanged. The incident and triage pages point to the replacement decision.

Validation: production build passed; the browser displayed the computed cause counts, timeline,
dedupe examples and signature-derived desk reference. Changing report A from form to app made
the explorer change from different causes to the same cause; switching back restored the split.
The page was visually checked, and the standalone HTML and PNG preserve the rendered evidence.

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.
