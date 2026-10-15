# EULGO mockups

A static directory of HTML website mockups. Open `index.html` in a browser to
browse pages grouped by section or search for a page. No installation or build
step is needed; all index assets are local.

## Update the directory

Add mockups under a section folder, then add their titles, relative paths, and
optional descriptions to `assets/pages.js`. The index renders this catalog
automatically on page load. Keep the `noscript` links in `index.html` in sync.
Files are listed intentionally; uploading an HTML file alone does not register it.

The initial **About** section contains:
- `about/about.html` — About the European Legal Gateway Office in India
- `about/faq.html` — Frequently asked questions

Shared mockup assets live in the root `assets/` folder. Pages in `about/`
reference them using `../assets/` so they work under the GitHub Pages repository
path.

`AGENTS.md` holds repository instructions and is changed only when explicitly
requested by the user.

## Publish with GitHub Pages

1. Commit and push the site files to `main`.
2. In the GitHub repository, open **Settings → Pages**.
3. Set **Source** to **Deploy from a branch**, select **main** and **/(root)**,
   then save.

The root `.nojekyll` file disables Jekyll processing. All site links are relative,
so the directory works under the repository's GitHub Pages URL.

See [GitHub's publishing source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
