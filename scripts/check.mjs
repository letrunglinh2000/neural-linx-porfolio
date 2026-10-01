import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
const html = readFileSync('dist/index.html','utf8');
for (const [,value] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (/^(https?:|data:|mailto:)/.test(value)) continue;
  if (value.startsWith('#')) assert(html.includes(`id="${value.slice(1)}"`), `Missing anchor ${value}`);
  else assert(existsSync(resolve('dist',value)), `Missing asset ${value}`);
}
const papers = JSON.parse(readFileSync('dist/data/publications.json','utf8'));
assert(Array.isArray(papers));
for (const p of papers) {
  assert(typeof p.title === 'string' && p.title.trim());
  assert(Array.isArray(p.authors) && p.authors.length && p.authors.every(a => typeof a === 'string'));
  assert(typeof p.venue === 'string' && p.venue.trim());
  assert(Number.isInteger(p.year) && p.year >= 1900);
  for (const link of Object.values(p.links || {})) {
    assert(typeof link === 'string' && link.length);
    if (/^https?:/.test(link)) new URL(link);
    else assert(existsSync(resolve('dist', link)), `Missing paper asset ${link}`);
  }
  assert(!/Coauthor [A-Z]|YOURUSER|XXXX|10\.1000\//.test(JSON.stringify(p)), 'Placeholder publication');
}
assert(!/YOURUSER|user=XXXX|you@example.com|Coauthor [A-Z]/.test(html));
execFileSync(process.execPath,['--check','dist/app.js']);
console.log(`PASS: local assets, navigation anchors, JavaScript syntax, and ${papers.length} publication records.`);
