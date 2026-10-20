# Repository instructions

## Purpose
This repository publishes HTML mockups through GitHub Pages. Keep the website
static: HTML, CSS, and browser JavaScript only, with no framework, package
installation, server, or build step required.

## Index and content
- `index.html` is the sitemap-style entry point for visitors.
- `assets/pages.js` is the page catalog. Update it when instructed to add,
  remove, rename, or regroup pages; the index renders it in the browser.
- Home is the first directory entry, outside all categories. It lives in
  `window.mockupPages`, links to `home.html`, and displays `/`. Categorized
  entries live in `window.mockupSections`.
- Categories are synthetic groupings explicitly chosen by the user, independent
  of folder structure. The About category contains root `about.html` and `faq.html`.
- Before adding a new page to the directory, ask the user for its category and
  desired URL for display unless they have already supplied both.
- Set `displayPath` in the catalog for the desired visual URL; keep `path` as
  the actual relative file URL. Match display labels in the `noscript` fallback.
- Keep directory entries compact, showing only the title and displayed path.
- Requested unavailable pages use `available: false` and a "Not available"
  badge. Render them as plain, non-clickable entries in both directory versions;
  omit URL fields until supplied. A supplied `displayPath` can appear without
  a link; omit the actual `path` until a file is available. Ask for the display
  URL when activating a placeholder if it has not already been supplied.
- About is a synthetic category: its page display URLs are rooted directly
  at `/`, never under `/about/`. Use title-based slugs for its legal and
  accessibility placeholders.
- The Glossary is root `glossary.html`, displayed as `/glossary` under About.
  It follows the `how-legal-mobility-works.html` resource template, with each
  source term as a heading for contents navigation. Preserve definitions and
  source links; do not inherit the template's AI or review-status labels.
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

## Importing exported mockups
- Keep Candidates and Employers and HEI as the first two directory categories,
  in that order. Moving to the EU is the first Candidates page. Show empty
  categories with a brief placeholder until pages are supplied.
- Sort the remaining Candidates pages alphabetically by their display titles;
  apply the same order in the catalog and the `noscript` fallback.
- The user specifies the section and page slugs for each import. Copy only
  requested pages from the source export, naming them `<section>/<slug>.html`.
  For Candidates, display `/candidates/<slug>`; actual links retain `.html`.
  Exception: Moving to the EU displays `/candidates` and links to
  `candidates/moving-to-the-eu.html`.
  Ask for the desired display prefix for a new section if it is not supplied.
- Employers and HEI pages use `employers-and-higher-education/<slug>.html`
  and display `/employers-and-higher-education/<slug>`.
- For Employers and Higher Education Institutions always stays first under
  Employers and HEI and displays `/employers-and-higher-education`. It links to
  `employers-and-higher-education/recruiter.html`, imported from
  `/mnt/c/Downloads/mockups-2026-10-20/recruiter.html`. Map old `employers-heis.html`
  and `/employers-heis` links to this page.
- The recruiter export's assets and shared header/footer script are isolated in
  `assets/employers-landing/` to preserve its design without overwriting other
  mockups. Copy dependencies recursively, including CSS imports/fonts, images
  in `srcset`, and image references in the shared script. Update the copied
  script's page links and asset paths for its new location.
- Home, Candidates, and Employers landing entries use `landingPage: true` to
  display a grey "Landing page" badge alongside any availability badge.
- Use readable titles matching the supplied slugs, including the HTML title
  and main page heading. Keep the remaining mockup content and design intact.
- Default export source on this computer:
  `/mnt/d/Nextcloud/Projects/Drupal projects/ELGO (ICMPD)/05_Information_architecture_and_design/2026-10-14 home candidates eu_predict visa wizard`.
  If unavailable on another computer, ask for its local location.
- Additional static page exports are in the sibling `2026-10-14 static pages`
  folder. Use it for `know-your-rights.html`, `eu-blue-card.html`, and
  `students-checklist.html`.
- Resource aliases: `candidate-rights` maps to `candidates/know-your-rights.html`,
  and `eu-blue-card-essential-information` maps to `candidates/eu-blue-card.html`.
  `prepare-for-your-study-in-europe` maps to `candidates/students-checklist.html`.
  Labour Market Test Guide keeps the `labour-market-test` filename and display slug.
- Adjust asset references for the destination depth (`../assets/` from
  `candidates/`). Reuse shared assets; copy required support files and downloads
  that are absent. Export support scripts are under `assets/offline/` and PDFs
  under `assets/pdf/` with slug-based filenames.
- Map old flat export filenames and matching original routes (including
  `/candidates/resources/<slug>`) to the imported file's relative URL. Preserve
  query strings and fragments. Update cross-links in existing mockups as well
  as the new pages; Home links should target root `home.html`.
- If a placeholder anchor uses `href="#"` with a mapped `data-href`, set its
  actual `href` to the local target too so it works without a custom handler.
- Keep links to pages not yet imported intact and report that limitation.
  Do not import extra pages or invent their directory entries.
- Add imports to `assets/pages.js` and the root index's `noscript` fallback.
  Verify ordering, display paths, search, cross-links, assets, and downloads.

## Converting client documents
- For DOCX guides, follow `candidates/visa-readiness-checklist.html` as the
  resource-page template: shared header/footer, introduction, metadata, contents
  navigation, article body, and sharing controls. Use the employer colour mode
  for employer guides.
- Preserve source paragraphs, tables, lists, inline formatting, and hyperlink
  targets, including Word field-code hyperlinks. Use accessible table headers
  and scrollable table wrappers. Verify converted content against the DOCX.
- Replace inherited titles, descriptions, breadcrumbs, audience, downloads,
  and sharing metadata. Do not inherit the checklist's publication date,
  current-status label, or editorial ownership for an undated client document.
- Guide downloads must always be PDF, linking to `assets/pdf/<slug>.pdf`
  with a "Download PDF" label. Editors convert DOCX sources to PDF and add the
  file before publishing. If it is not yet present, keep the expected PDF link
  and report the missing file; do not offer the DOCX as the website download.

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
