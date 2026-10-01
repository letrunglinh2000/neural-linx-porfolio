# Le Trung Linh — Research profile

A responsive academic homepage emphasizing publications, with light/dark themes and an accessible, dependency-free static frontend.

## Local preview

Run `node scripts/serve.mjs` and open http://127.0.0.1:4173.
Run `node scripts/check.mjs` to validate local assets and publication data.

## Update publications

Edit `dist/data/publications.json`. The current list is intentionally empty: the supplied homepage templates contain fictional coauthors, placeholder identifiers, and unverified publication claims. Those records were not published. Research in preparation is displayed separately, based on the supplied vCard design; it is not represented as accepted work.

Each real publication should use this structure (illustrative schema only):

```json
{
  "title": "Exact paper title",
  "authors": ["Le Trung Linh", "Full coauthor name"],
  "venue": "Full venue or preprint status",
  "year": 2026,
  "tags": ["Image restoration"],
  "links": {"doi": "https://doi.org/REAL_DOI", "code": "https://github.com/OWNER/REPOSITORY"},
  "abstract": "The actual abstract.",
  "bibtex": "The actual BibTeX citation."
}
```

Once records exist, the page automatically shows search, year filtering, newest-first sorting, expandable abstracts, and copyable citations. Include only available, verified links. Local PDF links can use `files/paper.pdf` with the file stored under `dist/files/`.

## Profile and content

Edit `dist/index.html` for biography, affiliation, research summaries, and contact information. The photo comes from the supplied Academic homepage design archive. Add your real Google Scholar URL, email, and CV when available; placeholder links are intentionally absent. Styling is in `dist/styles.css`; interactions are in `dist/app.js`.

## Hosting

The GitHub Actions workflow publishes the `dist` directory to GitHub Pages on pushes to `main`. In repository Settings → Pages, select GitHub Actions as the source if it is not already enabled. The site uses relative paths and supports the repository subpath `/neural-linx-porfolio/`.

The `.openai/hosting.json` manifest also supports the linked Sites deployment. No build or package installation is needed.
