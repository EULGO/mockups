# Repository instructions

## Purpose
This repository publishes HTML mockups through GitHub Pages. Keep the website
static: HTML, CSS, and browser JavaScript only, with no framework, package
installation, server, or build step required.

## Index and content
- `index.html` is the sitemap-style entry point for visitors.
- `assets/pages.js` is the page catalog. Update it when instructed to add,
  remove, rename, or regroup pages; the index renders it in the browser.
- Categories are synthetic groupings explicitly chosen by the user, independent
  of folder structure. The About category contains root `about.html` and `faq.html`.
- Before adding a new page to the directory, ask the user for its category and
  desired URL for display unless they have already supplied both.
- Set `displayPath` in the catalog for the desired visual URL; keep `path` as
  the actual relative file URL. Match display labels in the `noscript` fallback.
- Keep directory entries compact, showing only the title and displayed path.
- List the individual country profiles as nested children of Country profiles
  in the Countries category. Search must retain the parent when a child matches.
- Current display URLs are `/about`, `/faq`, `/countries`, and
  `/countries/<country>`. Actual links target root `about.html` and `faq.html`,
  `countries/countries.html`, and `countries/<country>.html` respectively.
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
Update this `AGENTS.md` when relevant project decisions, preferences, or workflows
change. Keep it concise and current; avoid recording routine implementation history.

## Continuing on another computer or in a new session
- The GitHub repository is `git@github.com:EULGO/mockups.git`; the working branch
  is `main`.
- Before switching computers, commit and push all changes that should travel
  with the project, including these instructions and directory catalog updates.
  Staged or uncommitted files do not transfer through a clone or pull.
- On another computer, configure GitHub access and clone the repository, or pull
  `main` into an existing clean checkout, then open that folder in Codex.
- Start by reading `AGENTS.md` and `README.md` and inspecting the current Git
  status. Use tracked files as project context rather than assuming the previous
  conversation is available.
- No dependency installation or build step is needed. Open root `index.html`
  in a browser to view the directory.
