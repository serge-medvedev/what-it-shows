// Evaluate this function in the running KB with Playwright; save its returned HTML.
() => {
  const routes = {
    '/kb': 'index',
    '/kb/triage/dedupe': 'triage-dedupe',
    '/kb/incidents/4471': 'incident-4471',
    '/kb/decisions/0001-dedupe-by-subject': '0001-dedupe-by-subject',
    '/kb/decisions/0002-triage-by-cause': '0002-triage-by-cause',
  };
  const source = document.querySelector('.kb');
  const body = source.cloneNode(true);
  for (const a of body.querySelectorAll('a')) {
    if (routes[a.getAttribute('href')]) a.setAttribute('href', routes[a.getAttribute('href')] + '.html');
  }
  const originals = source.querySelectorAll('input,select,textarea,button');
  body.querySelectorAll('input,select,textarea,button').forEach((el, i) => {
    const original = originals[i];
    if (el.tagName === 'INPUT') el.setAttribute('value', original.value);
    if (el.tagName === 'TEXTAREA') el.textContent = original.value;
    if (el.tagName === 'SELECT') {
      for (const option of el.options) option.toggleAttribute('selected', option.value === original.value);
    }
    el.setAttribute('disabled', '');
    el.setAttribute('title', 'Rendered snapshot; run the KB locally to interact');
  });
  const css = Array.from(document.styleSheets)
    .map((s) => Array.from(s.cssRules).map((r) => r.cssText).join('\n')).join('\n');
  const title = document.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<title>' + title + '</title><style>' + css + '</style></head><body>'
    + body.outerHTML + '</body></html>';
};
