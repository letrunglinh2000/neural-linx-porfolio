const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
let savedTheme;
try { savedTheme = localStorage.getItem('research-theme'); } catch {}
function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton.setAttribute('aria-label', `Use ${theme === 'dark' ? 'light' : 'dark'} theme`);
}
setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeButton.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  try { localStorage.setItem('research-theme', root.dataset.theme); } catch {}
});

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function safeLink(value) {
  try {
    const url = new URL(value, location.href);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function publicationCard(paper) {
  const article = element('article', 'publication');
  article.append(element('div', 'publication-year', `${paper.venue} · ${paper.year}`), element('h3', '', paper.title));
  const authors = element('p', 'publication-authors');
  paper.authors.forEach((author, index) => {
    if (index) authors.append(document.createTextNode(', '));
    authors.append(element(author.toLowerCase() === 'le trung linh' ? 'strong' : 'span', '', author));
  });
  article.append(authors);
  const links = element('div', 'paper-links');
  for (const [label, value] of Object.entries(paper.links || {})) {
    const href = safeLink(value);
    if (!href) continue;
    const link = element('a', '', ({pdf:'PDF',doi:'DOI',code:'Code',arxiv:'arXiv',project:'Project',slides:'Slides'})[label] || label);
    link.href = href;
    links.append(link);
  }
  if (paper.abstract) {
    const details = element('details');
    details.append(element('summary', '', 'Abstract'), element('p', '', paper.abstract));
    links.append(details);
  }
  if (paper.bibtex) {
    const details = element('details');
    const copy = element('button', '', 'Copy BibTeX');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(paper.bibtex); copy.textContent = 'Copied'; }
      catch { copy.textContent = 'Select and copy the citation below'; }
    });
    const message = element('span');
    message.setAttribute('role', 'status');
    message.append(copy);
    details.append(element('summary', '', 'Cite'), element('pre', '', paper.bibtex), message);
    links.append(details);
  }
  article.append(links);
  return article;
}
async function loadPublications() {
  const response = await fetch('data/publications.json');
  if (!response.ok) throw new Error('Publications could not be loaded');
  const papers = await response.json();
  if (!Array.isArray(papers)) throw new Error('Invalid publication data');
  if (!papers.length) return;
  papers.sort((a,b) => b.year - a.year);
  const search = document.querySelector('#publication-search');
  const years = document.querySelector('#publication-year');
  const list = document.querySelector('#publication-list');
  const count = document.querySelector('#publication-count');
  [...new Set(papers.map(p => p.year))].forEach(year => { const option = element('option', '', year); option.value = year; years.append(option); });
  document.querySelector('#publication-controls').hidden = false;
  count.hidden = false;
  function render() {
    const query = search.value.trim().toLowerCase();
    const filtered = papers.filter(p => (years.value === 'all' || String(p.year) === years.value) && [p.title, p.venue, ...p.authors, ...(p.tags || [])].join(' ').toLowerCase().includes(query));
    list.replaceChildren(...filtered.map(publicationCard));
    count.textContent = `${filtered.length} publication${filtered.length === 1 ? '' : 's'}`;
    if (!filtered.length) list.append(element('p', '', 'No publications match your search. Try a different title, topic, or year.'));
  }
  search.addEventListener('input', render);
  years.addEventListener('change', render);
  render();
}
loadPublications().catch(() => {
  document.querySelector('#publication-list').replaceChildren(element('p', '', 'The publication list is temporarily unavailable. Please refresh this page to try again.'));
});
