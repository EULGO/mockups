/*
 * Developer annotations for the Figma-based mockups.
 *
 * Adds a rail on the right with one short note per content component: its name,
 * the CSS classes, a one-line description and a link to the Figma component.
 * The site header, page header, side menu (On this page) and footer are left
 * out. Each component gets a numbered badge that matches its note.
 *
 * Notes are found automatically from the elgo-* classes below. To add or
 * override a note on one element, give it data-annotation="Your note".
 * The "Annotations" button turns the rail on and off; the choice is remembered.
 */
(() => {
  const figma = (node) => `https://www.figma.com/design/foZr4kJhTyHh6kD39ZmWCu/EULGO---Custom-theme?node-id=${node}&m=dev`;

  // One entry per component. "modifiers" lists the variants worth naming.
  const components = [
    {
      selector: '.elgo-notice',
      name: 'Notice',
      node: '923-4437',
      modifiers: ['elgo-notice--accent', 'elgo-notice--attention', 'elgo-notice--brand'],
      note: 'CKeditor style',
    },
    { selector: '.elgo-checklist', name: 'Checklist', node: '1346-6269', note: 'Bordered list, items tick on click' },
    { selector: '.elgo-options', name: 'Answer options', node: null, modifiers: ['elgo-options--radio', 'elgo-options--checkbox'], note: 'Radio (one answer) or checkbox (several) options' },
    { selector: '.elgo-pillars', name: 'Cards', node: '1346-6380', note: 'Cards with background colour' },
    { selector: '.elgo-flow', name: 'Steps', node: '1349-6449', note: 'Illustration list with numbers' },
    { selector: '.elgo-table-wrap', name: 'Table', node: '1351-6476', modifiers: ['elgo-table--data'], note: 'Bordered table, rows become cards on phones' },
    { selector: '.elgo-diagram', name: 'Comparison', node: '1353-6840', note: 'Container with round corner and background, coloured cards inside' },
    { selector: '.elgo-illustration-list', name: 'Illustration list', node: null, note: 'Illustration list with icons' },
    { selector: '.elgo-iconlist', name: 'Icon list', node: '1346-6342', note: 'Illustration list with icons' },
    { selector: '.elgo-portals', name: 'Link rows', node: '1352-6494', note: 'Entity embed in CKeditor' },
    { selector: '.elgo-sourcelist', name: 'Source list', node: '1352-6599', note: 'Reference links, title over domain' },
    { selector: '.elgo-split', name: 'Split', node: '1350-6399', note: 'Text with a notice beside it' },
    { selector: '.elgo-columns', name: 'Columns', node: '1353-6947', note: 'Two sections side by side' },
    { selector: '.elgo-guide-head', name: 'Heading with icon', node: '1351-6364', note: 'Heading led by an icon in a circle' },
    { selector: '.elgo-figure', name: 'Image', node: null, note: 'SVG image' },
    { selector: '.elgo-publication', name: 'Source', node: '1352-6517', note: 'Container with round corner and background' },
  ];

  const storageKey = 'elgo-annotations';
  const readChoice = () => {
    try {
      return localStorage.getItem(storageKey) !== 'off';
    }
    catch (error) {
      return true;
    }
  };
  const saveChoice = (on) => {
    try {
      localStorage.setItem(storageKey, on ? 'on' : 'off');
    }
    catch (error) {
      // Private windows may block storage; the toggle still works for this visit.
    }
  };

  const layer = document.createElement('div');
  layer.className = 'elgo-ann-layer';
  layer.setAttribute('aria-hidden', 'true');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'elgo-ann-toggle';

  // Notes mention tags such as <details>; show them as text, not markup.
  const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const describe = (element, entry) => {
    const classes = [entry.selector.slice(1)];
    (entry.modifiers || []).forEach((modifier) => {
      if (element.classList.contains(modifier) || element.querySelector(`.${modifier}`)) {
        classes.push(modifier);
      }
    });
    return classes;
  };

  const collect = () => {
    const found = [];
    components.forEach((entry) => {
      document.querySelectorAll(entry.selector).forEach((element) => {
        // Skip a component nested in another annotated one of the same kind.
        if (element.parentElement.closest(entry.selector)) {
          return;
        }
        found.push({ element, entry });
      });
    });
    document.querySelectorAll('[data-annotation]').forEach((element) => {
      const known = found.find((item) => item.element === element);
      if (known) {
        known.extra = element.dataset.annotation;
      }
      else {
        found.push({ element, entry: { name: 'Note', note: element.dataset.annotation } });
      }
    });
    return found.filter((item) => item.element.offsetParent !== null);
  };

  const render = () => {
    layer.textContent = '';
    document.querySelectorAll('.elgo-ann-target').forEach((element) => {
      element.classList.remove('elgo-ann-target');
      element.removeAttribute('data-ann-number');
    });
    if (!document.body.classList.contains('elgo-ann-on')) {
      return;
    }

    const rail = document.documentElement.clientWidth - layer.offsetWidth;
    const items = collect()
      .map((item) => ({ ...item, top: item.element.getBoundingClientRect().top + window.scrollY }))
      .sort((a, b) => a.top - b.top);

    let nextFree = 0;
    items.forEach((item, index) => {
      const number = index + 1;
      const rect = item.element.getBoundingClientRect();
      item.element.classList.add('elgo-ann-target');
      item.element.dataset.annNumber = number;

      const card = document.createElement('div');
      card.className = 'elgo-ann-card';
      const classes = item.entry.selector ? describe(item.element, item.entry) : [];
      card.innerHTML = `
        <p class="elgo-ann-card__name"><span class="elgo-ann-card__number">${number}</span>${item.entry.name}</p>
        ${classes.length ? `<p class="elgo-ann-card__classes">${classes.map((name) => `<code>${name}</code>`).join(' ')}</p>` : ''}
        <p class="elgo-ann-card__note">${escape(item.entry.note)}</p>
        ${item.extra ? `<p class="elgo-ann-card__note">${escape(item.extra)}</p>` : ''}
        ${item.entry.node ? `<a class="elgo-ann-card__link" href="${figma(item.entry.node)}" target="_blank" rel="noopener">Open in Figma</a>` : ''}
      `;
      layer.appendChild(card);

      const top = Math.max(item.top, nextFree);
      card.style.top = `${top}px`;
      nextFree = top + card.offsetHeight + 12;

      // Dashed line from the component to its note.
      const line = document.createElement('div');
      line.className = 'elgo-ann-line';
      const left = Math.min(rect.right, rail) + 4;
      line.style.left = `${left - rail}px`;
      line.style.width = `${Math.max(rail - left, 0) + 16}px`;
      line.style.top = `${top + 14}px`;
      layer.appendChild(line);

      // Numbered badge on the component's top-left corner. It lives in the layer
      // so components that clip their overflow (tables, cards) don't hide it.
      const badge = document.createElement('span');
      badge.className = 'elgo-ann-badge';
      badge.textContent = number;
      badge.style.left = `${rect.left - rail - 10}px`;
      badge.style.top = `${item.top - 10}px`;
      layer.appendChild(badge);

      card.addEventListener('mouseenter', () => item.element.classList.add('elgo-ann-target--hover'));
      card.addEventListener('mouseleave', () => item.element.classList.remove('elgo-ann-target--hover'));
    });
    layer.style.height = `${Math.max(document.documentElement.scrollHeight, nextFree)}px`;
  };

  const setOn = (on) => {
    document.body.classList.toggle('elgo-ann-on', on);
    toggle.textContent = on ? 'Hide annotations' : 'Show annotations';
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');
    saveChoice(on);
    render();
  };

  const start = () => {
    document.body.append(layer, toggle);
    toggle.addEventListener('click', () => setOn(!document.body.classList.contains('elgo-ann-on')));
    setOn(readChoice());

    let frame = 0;
    const later = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    window.addEventListener('resize', later);
    document.fonts?.ready.then(later);
    window.addEventListener('load', later);
    document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', later));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  }
  else {
    start();
  }
})();
