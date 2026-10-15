"use strict";

const directory = document.querySelector("#directory");
const search = document.querySelector("#search");
const count = document.querySelector("#page-count");
const emptyMessage = document.querySelector("#empty-message");
const sections = window.mockupSections;
function countPages(pages) {
  return pages.reduce((sum, page) => sum + 1 + countPages(page.children || []), 0);
}

const total = sections.reduce((sum, section) => sum + countPages(section.pages), 0);

function filterPages(pages, query, ancestors = "") {
  return pages.flatMap((page) => {
    const matches = [ancestors, page.title, page.path, page.displayPath]
      .join(" ").toLocaleLowerCase().includes(query);
    const children = filterPages(page.children || [], matches ? "" : query,
      `${ancestors} ${page.title}`);
    return matches || children.length ? [{ ...page, children }] : [];
  });
}

function renderPages(pages, nested = false) {
  const list = document.createElement("ul");
  list.className = nested ? "pages pages--nested" : "pages";

  for (const page of pages) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "page-link";
    link.href = page.path;
    const title = document.createElement("span");
    title.className = "page-title";
    title.textContent = page.title;
    const path = document.createElement("span");
    path.className = "page-path";
    path.textContent = page.displayPath || page.path;
    link.append(title, path);
    item.append(link);
    if (page.children.length) item.append(renderPages(page.children, true));
    list.append(item);
  }

  return list;
}

function renderDirectory() {
  const query = search.value.trim().toLocaleLowerCase();
  const fragment = document.createDocumentFragment();
  let visible = 0;

  for (const [index, section] of sections.entries()) {
    const pages = filterPages(section.pages, query, section.title);
    if (!pages.length) continue;
    visible += countPages(pages);

    const group = document.createElement("section");
    group.className = "section";
    const heading = document.createElement("h2");
    heading.id = `section-${index}`;
    heading.textContent = section.title;
    group.setAttribute("aria-labelledby", heading.id);
    group.append(heading, renderPages(pages));
    fragment.append(group);
  }

  directory.replaceChildren(fragment);
  count.textContent = query
    ? `${visible} of ${total} pages`
    : `${total} ${total === 1 ? "page" : "pages"} · ${sections.length} ${sections.length === 1 ? "section" : "sections"}`;
  emptyMessage.hidden = visible > 0;
}

renderDirectory();
document.querySelector("#search-tools").hidden = false;
search.addEventListener("input", renderDirectory);
