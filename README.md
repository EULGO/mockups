# EULGO mockups

A static directory of HTML website mockups. Open `index.html` in a browser to
browse pages grouped by section or search for a page. No installation or build
step is needed; all index assets are local.

## Update the directory

Add mockups, then add their titles and relative paths to `assets/pages.js`.
Use an optional `displayPath` to show a different path label without changing
the link target. The index renders this catalog
automatically on page load. Keep the `noscript` links in `index.html` in sync.
Files are listed intentionally; uploading an HTML file alone does not register it.

Home appears at the top without a category, displaying `/` and linking to
`home.html`. Its catalog entry is in `window.mockupPages`; categorized pages
are in `window.mockupSections`.

Candidates and Employers and HEI are the first categories. Candidate imports live in
`candidates/<slug>.html` and display `/candidates/<slug>`. Moving to the EU is the
exception: it displays `/candidates` and stays first within Candidates.
Employer guides live in `employers-and-higher-education/<slug>.html` and display
`/employers-and-higher-education/<slug>`.
The repeatable export-import workflow and source location are in `AGENTS.md`.

Categories are synthetic groupings chosen explicitly by the user; they do not
need to match the folder structure. The **About** category contains:

- `about.html` — About the European Legal Gateway Office in India (displayed as `/about`)
- `faq.html` — Frequently asked questions (displayed as `/faq`)

Shared mockup assets live in the root `assets/` folder. The root About and FAQ pages
reference them using `assets/` so they work under the GitHub Pages repository
path.

`AGENTS.md` holds repository instructions and cross-computer handoff guidance.
Keep it current when relevant project decisions or workflows change.

## Publish with GitHub Pages

1. Commit and push the site files to `main`.
2. In the GitHub repository, open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, select **main** and **/(root)**,
   then save.

The root `.nojekyll` file disables Jekyll processing. All site links are relative,
so the directory works under the repository's GitHub Pages URL.

See [GitHub's publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
