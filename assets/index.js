"use strict";

const directory = document.querySelector("#directory");
const search = document.querySelector("#search");
const count = document.querySelector("#page-count");
const emptyMessage = document.querySelector("#empty-message");
const sections = window.mockupSections;
const total = sections.reduce((sum, section) => sum + section.pages.length, 0);

function renderDirectory() {
  const query = search.value.trim().toLocaleLowerCase();
  const fragment = document.createDocumentFragment();
  let visible = 0;

  for (const [index, section] of sections.entries()) {
    const pages = section.pages.filter((page) =>
      [section.title, page.title, page.description, page.path]
        .join(" ").toLocaleLowerCase().includes(query)
    );
    if (!pages.length) continue;
    visible += pages.length;

    const group = document.createElement("section");
    group.className = "section";
    const heading = document.createElement("h2");
    heading.id = `section-${index}`;
    heading.textContent = section.title;
    group.setAttribute("aria-labelledby", heading.id);
    const list = document.createElement("ul");
    list.className = "pages";

    for (const page of pages) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.className = "page-link";
      link.href = page.path;
      const title = document.createElement("span");
      title.className = "page-title";
      title.textContent = page.title;
      const description = document.createElement("span");
      description.className = "page-description";
      description.textContent = page.description || "";
      const path = document.createElement("span");
      path.className = "page-path";
      path.textContent = page.path;
      link.append(title, description, path);
      item.append(link);
      list.append(item);
    }
    group.append(heading, list);
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
