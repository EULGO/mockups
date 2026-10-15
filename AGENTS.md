# Repository instructions

## Purpose
This repository publishes HTML mockups through GitHub Pages. Keep the website
static: HTML, CSS, and browser JavaScript only, with no framework, package
installation, server, or build step required.

## Index and content
- `index.html` is the sitemap-style entry point for visitors.
- `assets/pages.js` is the page catalog. Update it when instructed to add,
  remove, rename, or regroup pages; the index renders it in the browser.
- Organize mockups into section folders. The initial About section contains
  `about/about.html` and `about/faq.html`.
- Use relative URLs so navigation works under a GitHub Pages repository path.
- Keep the index responsive, keyboard accessible, and easy to scan by section.
- When changing the catalog, also update the links in the index's `noscript`
  fallback so visitors without JavaScript can still reach every mockup.
- Preserve supplied mockups unless the user requests changes to them.
- Static hosting cannot discover files automatically. Register new mockups in
  the catalog when the user instructs you to include them in the index.

## Publishing and verification
- Publish the root of `main` using GitHub Pages' branch publishing option.
- Keep `.nojekyll` to serve the static content without Jekyll processing.
- Check JavaScript syntax and verify catalog links point to existing HTML files
  after changing the index. No automated test framework is required.
- Flag missing mockup assets; do not silently rewrite their design or content.

## Maintaining these instructions
Update this `AGENTS.md` file only upon the user's explicit instructions.
Do not automatically add rules based on routine implementation decisions.
