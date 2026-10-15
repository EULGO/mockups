/**
 * @file
 * ELGO behaviours: EU Predict tabs and panel toggle, list filters, auto-submit.
 */
((Drupal, once) => {
  Drupal.behaviors.elgoPredict = {
    attach(context) {
      once('elgo-predict', '[data-elgo-predict]', context).forEach((root) => {
        const tabs = [...root.querySelectorAll('[role="tab"]')];
        const select = (tab) => tabs.forEach((t) => {
          const on = t === tab;
          t.classList.toggle('is-active', on);
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          root.querySelector('#' + t.getAttribute('aria-controls')).hidden = !on;
        });
        tabs.forEach((tab, i) => {
          tab.tabIndex = tab.classList.contains('is-active') ? 0 : -1;
          tab.addEventListener('click', () => select(tab));
          tab.addEventListener('keydown', (ev) => {
            if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
            const next = tabs[(i + (ev.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
            select(next);
            next.focus();
          });
        });
        // Destinations: checkbox dropdown + removable chips.
        root.querySelectorAll('[data-elgo-multiselect]').forEach((box) => {
          const chips = box.parentElement.querySelector('[data-elgo-chips]');
          const render = () => {
            chips.innerHTML = '';
            box.querySelectorAll('input:checked').forEach((input) => {
              const name = input.nextElementSibling.textContent;
              const li = document.createElement('li');
              const chip = document.createElement('button');
              chip.type = 'button';
              chip.className = 'elgo-chip';
              chip.dataset.value = input.value;
              chip.setAttribute('aria-label', Drupal.t('Remove @c', { '@c': name }));
              chip.textContent = name + ' ';
              const x = document.createElement('span');
              x.setAttribute('aria-hidden', 'true');
              x.textContent = '×';
              chip.appendChild(x);
              li.appendChild(chip);
              chips.appendChild(li);
            });
          };
          box.addEventListener('change', render);
          chips.addEventListener('click', (ev) => {
            const chip = ev.target.closest('.elgo-chip');
            const input = chip && box.querySelector(`input[value="${chip.dataset.value}"]`);
            if (input) {
              input.checked = false;
              render();
            }
          });
          document.addEventListener('click', (ev) => { if (box.open && !box.contains(ev.target)) box.open = false; });
          box.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
              box.open = false;
              box.querySelector('summary').focus();
            }
          });
        });
        const toggle = root.querySelector('[data-elgo-panel-toggle]');
        const body = root.querySelector('[data-elgo-panel-body]');
        if (toggle && body) {
          toggle.addEventListener('click', () => {
            const open = toggle.getAttribute('aria-expanded') === 'true';
            body.hidden = open;
            toggle.setAttribute('aria-expanded', String(!open));
            toggle.textContent = open ? Drupal.t('Show preferences') + ' ↓' : Drupal.t('Hide preferences') + ' ↑';
          });
        }
      });
      once('elgo-autosubmit', '[data-elgo-autosubmit]', context).forEach((el) => {
        el.addEventListener('change', () => (el.form || document.getElementById(el.getAttribute('form'))).requestSubmit());
      });
    },
  };

  Drupal.behaviors.elgoFilters = {
    attach(context) {
      // Country directory: filter + show all.
      once('elgo-countries', '[data-elgo-countries]', context).forEach((root) => {
        const input = root.querySelector('[data-elgo-countries-filter]');
        const items = root.querySelectorAll('[data-elgo-countries-list] li');
        const toggle = root.querySelector('[data-elgo-countries-toggle]');
        let all = false;
        const apply = () => {
          const q = (input.value || '').toLowerCase();
          items.forEach((li) => {
            const match = li.textContent.toLowerCase().includes(q);
            li.hidden = !match || (!all && !q && li.classList.contains('elgo-is-extra'));
          });
        };
        input.addEventListener('input', apply);
        if (toggle) {
          toggle.addEventListener('click', () => {
            all = !all;
            toggle.setAttribute('aria-expanded', String(all));
            toggle.textContent = all ? Drupal.t('Show fewer countries') + ' ↑' : Drupal.t('Show all countries') + ' ↓';
            apply();
          });
        }
      });
      // Checkbox lists with a text filter (resource browser countries).
      once('elgo-filterable', '[data-elgo-filterable]', context).forEach((root) => {
        const input = root.querySelector('[data-elgo-filter-input]');
        input.addEventListener('input', () => {
          const q = input.value.toLowerCase();
          root.querySelectorAll('li').forEach((li) => { li.hidden = !li.textContent.toLowerCase().includes(q); });
        });
      });
    },
  };
})(Drupal, once);

((Drupal, once) => {
  Drupal.behaviors.elgoV2 = {
    attach(context) {
      // Copy link / print.
      once('elgo-copy', '[data-elgo-copy]', context).forEach((btn) => btn.addEventListener('click', () => {
        const label = btn.querySelector('.elgo-share__label') || btn;
        const done = () => { label.textContent = Drupal.t('Link copied'); };
        (navigator.clipboard ? navigator.clipboard.writeText(window.location.href).then(done) : Promise.reject()).catch(() => window.prompt(Drupal.t('Copy this link'), window.location.href));
      }));
      once('elgo-print', '[data-elgo-print]', context).forEach((btn) => btn.addEventListener('click', () => window.print()));

      // Visa Wizard plan: "x of y ready" per checklist group and in the side panel.
      once('elgo-checklist', '[data-elgo-checklist]', context).forEach((list) => {
        const progress = document.querySelector('[data-elgo-progress]');
        const update = () => {
          let done = 0;
          let all = 0;
          list.querySelectorAll('.elgo-checkgroup').forEach((group) => {
            const boxes = group.querySelectorAll('input[type="checkbox"]');
            const ticked = group.querySelectorAll('input[type="checkbox"]:checked').length;
            done += ticked;
            all += boxes.length;
            group.querySelector('[data-elgo-ready]').textContent = Drupal.t('@done of @all ready', { '@done': ticked, '@all': boxes.length });
          });
          if (progress) {
            progress.querySelector('[data-elgo-progress-text]').textContent = Drupal.t('@done of @all ready', { '@done': done, '@all': all });
            progress.querySelector('[data-elgo-progress-bar]').style.width = all ? `${(100 * done) / all}%` : '0';
          }
        };
        list.addEventListener('change', update);
        update();
      });

      // EU Predict: add language rows.
      once('elgo-add-lang', '[data-elgo-add-lang]', context).forEach((btn) => btn.addEventListener('click', () => {
        const rows = btn.parentElement.querySelector('[data-elgo-lang-rows]');
        const last = rows.lastElementChild;
        const clone = last.cloneNode(true);
        clone.querySelectorAll('select').forEach((s) => { s.value = ''; });
        rows.appendChild(clone);
      }));

      // Country explorer: search + "show countries with".
      once('elgo-explorer', '[data-elgo-explorer]', context).forEach((root) => {
        const q = root.querySelector('[data-elgo-explorer-q]');
        const filter = root.querySelector('[data-elgo-explorer-filter]');
        const apply = () => {
          const text = (q.value || '').toLowerCase();
          const f = filter.value;
          root.querySelectorAll('[data-elgo-explorer-list] li').forEach((li) => {
            li.hidden = !li.dataset.name.includes(text) || (f && li.dataset[f] !== '1');
          });
        };
        q.addEventListener('input', apply);
        filter.addEventListener('change', apply);
      });

      // Select that navigates (country switcher).
      once('elgo-autonav', '[data-elgo-autonavigate]', context).forEach((sel) => sel.addEventListener('change', () => { if (sel.value) { window.location = sel.value; } }));

      // Article: build "On this page" from the sections (h2), or from h2/h3
      // when there are few sections. Headings in [data-elgo-toc-skip] (an
      // introduction) are left out.
      once('elgo-toc', '[data-elgo-toc]', context).forEach((nav) => {
        const source = document.querySelector('[data-elgo-toc-source]');
        const pick = (selector) => (source ? [...source.querySelectorAll(selector)].filter((h) => !h.closest('[data-elgo-toc-skip]')) : []);
        const sections = pick('h2');
        const heads = sections.length >= 3 ? sections : pick('h2, h3');
        if (heads.length < 2) { nav.hidden = true; return; }
        const list = nav.querySelector('ul');
        // Heading ids come from their text ("Cookies" → #cookies), so links to
        // a part of a page keep working; numbered when the text repeats.
        const used = {};
        heads.forEach((h, i) => {
          if (!h.id) {
            const slug = h.textContent.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section-' + (i + 1);
            h.id = used[slug] ? slug + '-' + (used[slug] + 1) : slug;
            used[slug] = (used[slug] || 0) + 1;
          }
          const li = document.createElement('li');
          li.innerHTML = '<a href="#' + h.id + '"></a>';
          li.firstChild.textContent = h.textContent;
          list.appendChild(li);
        });
        // The ids exist only now: go to the part the address points to.
        const target = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
        if (target) {
          target.scrollIntoView();
        }
      });

      // Gateway assistant.
      once('elgo-assistant', '[data-elgo-assistant]', context).forEach((root) => {
        const panel = root.querySelector('.elgo-assistant__panel');
        const launcher = root.querySelector('.elgo-assistant__launcher');
        // Open or closed, kept while moving between pages (session only).
        const remember = (open) => { try { sessionStorage.setItem('elgo-assistant-open', open ? '1' : ''); } catch (e) { /* Storage blocked. */ } };
        root.querySelectorAll('[data-elgo-assistant-toggle]').forEach((b) => b.addEventListener('click', () => {
          const open = panel.hidden;
          panel.hidden = !open;
          launcher.setAttribute('aria-expanded', String(open));
          remember(open);
          if (open) { panel.querySelector('a, input, button').focus(); }
        }));
        root.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && !panel.hidden) { panel.hidden = true; launcher.setAttribute('aria-expanded', 'false'); remember(false); launcher.focus(); } });
        try {
          if (sessionStorage.getItem('elgo-assistant-open')) {
            panel.hidden = false;
            launcher.setAttribute('aria-expanded', 'true');
          }
        } catch (e) { /* Storage blocked. */ }
      });
    },
  };
})(Drupal, once);

((Drupal, once) => {
  Drupal.behaviors.elgoWizard = {
    attach(context) {
      // Conditional questions: data-elgo-when="field=value|value2".
      // Plan answers that contradict each other: "looking for a job (no job
      // offer yet)" excludes a job offer and a company transfer, and back.
      once('elgo-wizard-exclusive', '[data-elgo-wizard]', context).forEach((root) => {
        const groups = [['job_search'], ['qualified_job_offer', 'same_group_transfer']];
        const yesInput = (name) => root.querySelector('input[name="' + name + '"][value="yes"]');
        const apply = () => groups.forEach((group, i) => {
          const other = groups[1 - i];
          const blocked = other.some((n) => yesInput(n) && yesInput(n).checked);
          group.forEach((name) => {
            const input = yesInput(name);
            if (!input) {
              return;
            }
            const fieldset = input.closest('fieldset');
            input.disabled = blocked;
            input.closest('label').classList.toggle('is-disabled', blocked);
            let note = fieldset.querySelector('.elgo-exclusive-note');
            if (blocked && !note) {
              note = document.createElement('p');
              note.className = 'elgo-hint elgo-exclusive-note';
              note.textContent = name === 'job_search'
                ? Drupal.t('Not possible together with a job offer or a company transfer.')
                : Drupal.t('Not possible together with looking for a job.');
              fieldset.appendChild(note);
            }
            else if (!blocked && note) {
              note.remove();
            }
          });
        });
        root.addEventListener('change', (ev) => {
          // The latest "Yes" wins: a contradicting earlier "Yes" becomes "No".
          const t = ev.target;
          groups.forEach((group, i) => {
            if (t.value === 'yes' && group.includes(t.name)) {
              groups[1 - i].forEach((n) => {
                const no = root.querySelector('input[name="' + n + '"][value="no"]');
                if (yesInput(n) && yesInput(n).checked && no) {
                  no.checked = true;
                }
              });
            }
          });
          apply();
        });
        apply();
      });
      once('elgo-wizard-when', '[data-elgo-wizard]', context).forEach((root) => {
        const deps = root.querySelectorAll('[data-elgo-when]');
        // An answer inside a hidden question does not count, so dependent
        // questions (e.g. the offer country under "linked to this country?")
        // hide with it; two passes settle nested dependencies.
        const pass = () => deps.forEach((el) => {
          const [name, values] = el.dataset.elgoWhen.split('=');
          const checked = root.querySelector('input[name="' + name + '"]:checked:not(:disabled)');
          const visible = checked && values.split('|').includes(checked.value);
          el.hidden = !visible;
          el.querySelectorAll('input, select').forEach((f) => { f.disabled = !visible; });
        });
        const apply = () => { deps.forEach((el) => el.querySelectorAll('input, select').forEach((f) => { f.disabled = false; })); pass(); pass(); };
        root.addEventListener('change', apply);
        apply();
      });
      once('elgo-restart', '[data-elgo-restart]', context).forEach((a) => a.addEventListener('click', (ev) => {
        if (!window.confirm(Drupal.t('Start again? Your answers will be cleared.'))) { ev.preventDefault(); }
      }));
    },
  };
})(Drupal, once);

((Drupal, once) => {
  // Design feedback §1: a short, labelled processing beat before EU Predict results.
  const KEY = 'elgoPredictSubmitted';
  Drupal.behaviors.elgoPredictMatching = {
    attach(context) {
      once('elgo-predict-submit', '#elgo-predict-form', context).forEach((form) => {
        form.addEventListener('submit', () => { try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage unavailable */ } });
      });
      once('elgo-predict-matching', '#results', context).forEach((results) => {
        let submitted = false;
        try { submitted = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        if (!submitted) { return; }
        const grid = results.querySelector('.elgo-pathways');
        const head = results.querySelector('.elgo-results__head');
        if (!grid) { return; }
        const board = grid.classList.contains('elgo-pathways--board');
        const holder = document.createElement('div');
        holder.className = 'elgo-matching';
        holder.setAttribute('role', 'status');
        holder.innerHTML = '<p class="elgo-matching__label"><span class="elgo-matching__dot" aria-hidden="true"></span>' + Drupal.t('Matching your answers to pathways…') + '</p><div class="elgo-matching__bar" aria-hidden="true"><span></span></div>'
          + '<div class="elgo-pathways ' + (board ? 'elgo-pathways--board' : 'elgo-pathways--list') + '" aria-hidden="true">'
          + '<div class="elgo-skeleton"><i></i><i></i><i></i><i></i><i></i></div>'.repeat(board ? 3 : 2) + '</div>';
        grid.hidden = true;
        if (head) { head.style.visibility = 'hidden'; }
        grid.parentNode.insertBefore(holder, grid);
        results.scrollIntoView({ block: 'start' });
        window.setTimeout(() => {
          holder.remove();
          grid.hidden = false;
          if (head) { head.style.visibility = ''; }
          const title = results.querySelector('.elgo-results__title');
          if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
        }, 1100);
      });
    },
  };
})(Drupal, once);

/**
 * Starter page hero slideshow (mockups 2026-09-29, mkSlideshow in
 * assets/mockups.js): autoplay every 5 s (a plain fade with reduced motion),
 * dots, a Pause button, pauses on hover; one caption per photo.
 */
(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.elgoSlideshow = {
    attach(context) {
      once('elgo-slideshow', '[data-elgo-slideshow]', context).forEach((stage) => {
        const slides = stage.querySelectorAll('.mk-slides img');
        const dots = stage.querySelector('.mk-dots');
        const cap = stage.querySelector('.mk-cap');
        if (slides.length < 2 || !dots) {
          return;
        }
        let cur = 0;
        let timer = null;
        let paused = false;
        slides.forEach((_, i) => {
          dots.insertAdjacentHTML('beforeend', '<button type="button" aria-label="' + Drupal.t('Photo @n of @total', { '@n': i + 1, '@total': slides.length }) + '"' + (i ? '' : ' aria-current="true"') + '></button>');
        });
        dots.insertAdjacentHTML('beforeend', '<button type="button" class="mk-pause" aria-pressed="false">' + Drupal.t('Pause') + '</button>');
        const dotBtns = dots.querySelectorAll('button:not(.mk-pause)');
        const pauseBtn = dots.querySelector('.mk-pause');
        const go = (i) => {
          slides[cur].classList.remove('is-on');
          dotBtns[cur].removeAttribute('aria-current');
          cur = (i + slides.length) % slides.length;
          slides[cur].classList.add('is-on');
          dotBtns[cur].setAttribute('aria-current', 'true');
          if (cap) {
            cap.textContent = slides[cur].dataset.cap;
          }
        };
        const stop = () => {
          clearInterval(timer);
          timer = null;
        };
        const start = () => {
          stop();
          if (!paused) {
            timer = setInterval(() => go(cur + 1), 5000);
          }
        };
        dotBtns.forEach((b, i) => b.addEventListener('click', () => {
          go(i);
          start();
        }));
        pauseBtn.addEventListener('click', () => {
          paused = !paused;
          pauseBtn.setAttribute('aria-pressed', String(paused));
          pauseBtn.textContent = paused ? Drupal.t('Play') : Drupal.t('Pause');
          start();
        });
        stage.addEventListener('mouseenter', stop);
        stage.addEventListener('mouseleave', start);
        start();
      });
    },
  };
})(Drupal, once);

/**
 * Personal page (mockups 2026-09-29, personal.html): the sticky step bar and
 * the first EU Predict questions ("finder"), from the page's own script.
 */
(function (Drupal, once) {
  'use strict';

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Step bar: current step, and how far through each step you are. The bar
  // stays under the ticket (so its shadow shows) until it sticks to the top.
  Drupal.behaviors.elgoStepBar = {
    attach(context) {
      once('elgo-stepbar', '[data-elgo-stepbar]', context).forEach((bar) => {
        const links = Array.from(bar.querySelectorAll('a[href^="#"]'));
        const pairs = links.map((a) => [a, document.getElementById(a.getAttribute('href').slice(1))]).filter((p) => p[1]);
        const track = () => {
          bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= 0);
          const line = bar.getBoundingClientRect().bottom + window.innerHeight * 0.25;
          let current = -1;
          pairs.forEach(([a, s], i) => {
            const r = s.getBoundingClientRect();
            const p = Math.max(0, Math.min(1, (line - r.top) / r.height));
            const li = a.parentNode;
            li.style.setProperty('--p', p.toFixed(3));
            li.classList.toggle('is-done', p >= 1);
            if (r.top <= line && r.bottom > line) {
              current = i;
            }
          });
          pairs.forEach(([a], i) => {
            if (i === current) {
              a.setAttribute('aria-current', 'step');
            }
            else {
              a.removeAttribute('aria-current');
            }
          });
        };
        let ticking = false;
        window.addEventListener('scroll', () => {
          if (ticking) {
            return;
          }
          ticking = true;
          requestAnimationFrame(() => {
            track();
            ticking = false;
          });
        }, { passive: true });
        window.addEventListener('resize', track);
        track();
      });
    },
  };

  // The first three EU Predict questions. The list shows the pathways of the
  // Gateway's data that match the answers so far (never "eligible");
  // "Continue in EU Predict" sends the answers as EU Predict parameters.
  Drupal.behaviors.elgoPredictStart = {
    attach(context) {
      once('elgo-predict-start', '[data-elgo-predict-start]', context).forEach((root) => {
        const D = JSON.parse(root.querySelector('[data-elgo-predict-data]').textContent);
        const flow = root.querySelector('.mk-flow');
        const $ = (sel) => root.querySelector(sel);
        const GOAL = {};
        D.goals.forEach((g) => { GOAL[g.key] = g; });
        const QUAL = {};
        D.quals.forEach((q) => { QUAL[String(q.eqf)] = q; });
        const COUNTRY = {};
        D.countries.forEach((c) => { COUNTRY[c.tid] = c; });
        const esc = (s) => String(s).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
        const names = (ids) => {
          const n = ids.map((id) => COUNTRY[id].name);
          return n.length < 2 ? n[0] : n.slice(0, -1).join(', ') + ' ' + Drupal.t('and') + ' ' + n[n.length - 1];
        };
        const germany = D.countries.find((c) => c.name === 'Germany') || D.countries[0];
        const example = { goal: 'work', edu: '6', where: germany ? 'countries' : '', cc: germany ? [germany.tid] : [] };

        const results = (a) => {
          const goal = GOAL[a.goal];
          const eqf = a.edu ? Number(a.edu) : null;
          return D.pathways.filter((p) => goal.rt.indexOf(p.r) > -1
            && (eqf === null || p.q === null || eqf >= p.q)
            && (a.where !== 'countries' || !a.cc.length || a.cc.indexOf(p.c) > -1));
        };

        let A = { goal: '', edu: '', where: '', cc: [] };
        let lastN = null;
        const peek = $('[data-peek]');
        const open = (n, on) => {
          const el = root.querySelector('[data-reveal="' + n + '"]');
          el.classList.toggle('is-open', on);
          if (on) {
            el.removeAttribute('inert');
          }
          else {
            el.setAttribute('inert', '');
          }
        };
        const params = () => {
          const out = [];
          (GOAL[A.goal] ? GOAL[A.goal].rt : []).forEach((tid) => out.push(['rt[]', tid]));
          if (A.edu && QUAL[A.edu].tid) {
            out.push(['qual', QUAL[A.edu].tid]);
          }
          if (A.where === 'countries') {
            A.cc.forEach((tid) => out.push(['dest[]', tid]));
          }
          $('[data-params]').innerHTML = out.map((p) => '<input type="hidden" name="' + p[0] + '" value="' + esc(p[1]) + '">').join('');
        };
        const render = () => {
          const mine = !!A.goal;
          const a = mine ? A : example;
          const list = results(a);
          $('[data-n]').textContent = list.length;
          $('[data-noun]').textContent = list.length === 1 ? Drupal.t('pathway') : Drupal.t('pathways');
          const tag = $('[data-tag]');
          tag.textContent = mine ? Drupal.t('Yours so far') : Drupal.t('Example');
          tag.classList.toggle('is-yours', mine);
          const bits = [Drupal.t('For someone who wants to @verb', { '@verb': GOAL[a.goal].verb })];
          if (a.edu) {
            bits.push(Drupal.t('with @q', { '@q': QUAL[a.edu].with }));
          }
          if (a.where === 'countries' && a.cc.length) {
            bits.push(Drupal.t('interested in @c', { '@c': names(a.cc) }));
          }
          if (a.where === 'any') {
            bits.push(Drupal.t('open to any EU country'));
          }
          if (a.where === 'unsure') {
            bits.push(Drupal.t('not sure where yet'));
          }
          $('[data-for]').textContent = bits.join(', ') + '.' + (mine ? '' : ' ' + Drupal.t('Answer the questions to see yours.'));
          let html = list.slice(0, 3).map((p) => {
            const c = COUNTRY[p.c];
            return '<li><img src="' + esc(c ? c.flag : D.flagEu) + '" alt="' + esc(c ? c.name : '') + '"><b>' + esc(p.t) + '</b><a class="mk-link mk-link--ext" href="' + esc(p.u) + '">' + Drupal.t('Rules') + '</a><p>' + esc(p.s) + '</p></li>';
          }).join('');
          if (list.length > 3) {
            html += '<li class="mk-plist__more"><p>' + Drupal.t('And @n more in EU Predict.', { '@n': list.length - 3 }) + '</p></li>';
          }
          if (!list.length) {
            html = '<li class="mk-plist__none"><p>' + (a.goal === 'family'
              ? Drupal.t('Family reunification depends on the permit of your family member in the EU. EU Predict covers work, study and research pathways.')
              : Drupal.t('No pathways for these answers in the Gateway’s data yet. EU Predict and the country pages show what is covered.')) + '</p></li>';
          }
          $('[data-list]').innerHTML = html;
          // Phones: the bar that follows you through the questions.
          $('[data-peek-n]').textContent = list.length;
          $('[data-peek-t]').textContent = mine ? (list.length === 1 ? Drupal.t('pathway for you so far') : Drupal.t('pathways for you so far')) : Drupal.t('example pathways');
          if (lastN !== null && lastN !== list.length + ':' + mine) {
            peek.classList.remove('is-bump');
            void peek.offsetWidth;
            peek.classList.add('is-bump');
          }
          lastN = list.length + ':' + mine;
          peek.hidden = !mine;
          const answered = (A.goal ? 1 : 0) + (A.edu ? 1 : 0) + (A.where ? 1 : 0);
          root.querySelectorAll('[data-bar] i').forEach((b, i) => b.classList.toggle('on', i < answered));
          open(2, !!A.goal);
          open(3, !!A.edu);
          open(4, !!A.where);
          ['goal', 'edu', 'where'].forEach((q) => root.querySelector('[data-q="' + q + '"]').classList.toggle('is-done', !!A[q]));
          params();
        };
        if ('IntersectionObserver' in window) {
          new IntersectionObserver((en) => peek.classList.toggle('is-away', en[0].isIntersecting), { threshold: 0.2 }).observe($('.mk-results'));
        }
        peek.addEventListener('click', () => $('.mk-results').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }));

        const tokens = $('[data-tokens]');
        const drawTokens = () => {
          tokens.innerHTML = A.cc.map((id) => '<button type="button" class="mk-token" data-cc="' + id + '" aria-label="' + esc(Drupal.t('Remove @c', { '@c': COUNTRY[id].name })) + '"><img src="' + esc(COUNTRY[id].flag) + '" alt="">' + esc(COUNTRY[id].name) + '</button>').join('');
        };
        flow.addEventListener('click', (ev) => {
          const chip = ev.target.closest('.elgo-chip');
          if (!chip) {
            return;
          }
          const q = chip.closest('[data-q]').dataset.q;
          if (q === 'goal' || q === 'edu') {
            chip.closest('[data-q]').querySelectorAll('.elgo-chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
            A[q] = chip.dataset.v;
          }
          else if (chip.dataset.where) {
            const on = chip.getAttribute('aria-pressed') !== 'true';
            flow.querySelectorAll('[data-where]').forEach((c) => c.setAttribute('aria-pressed', String(on && c === chip)));
            A.where = on ? chip.dataset.where : (A.cc.length ? 'countries' : '');
            if (on) {
              A.cc = [];
              drawTokens();
            }
          }
          render();
        });
        $('[data-reset]').addEventListener('click', () => {
          A = { goal: '', edu: '', where: '', cc: [] };
          drawTokens();
          flow.querySelectorAll('.elgo-chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
          render();
          flow.querySelector('[data-q="goal"] .elgo-chip').focus();
        });

        // Country search: a combobox with autocomplete, several countries.
        const input = $('#mk-country');
        const lb = $('#mk-list');
        const phone = window.matchMedia('(max-width: 640px)');
        let active = -1;
        let matches = [];
        const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const search = () => {
          const q = norm(input.value.trim());
          matches = D.countries.filter((c) => A.cc.indexOf(c.tid) < 0 && (!q || norm(c.name).indexOf(q) === 0 || norm(c.name).indexOf(' ' + q) > -1));
          active = matches.length ? 0 : -1;
          lb.innerHTML = matches.length
            ? matches.map((c, i) => '<li role="option" id="mk-opt-' + c.tid + '" data-cc="' + c.tid + '" aria-selected="' + (i === active) + '"><img src="' + esc(c.flag) + '" alt="">' + esc(c.name) + '</li>').join('')
            : '<li class="mk-empty">' + esc(Drupal.t('No country matches “@q”', { '@q': input.value })) + '</li>';
          lb.hidden = false;
          input.setAttribute('aria-expanded', 'true');
          input.setAttribute('aria-activedescendant', active > -1 ? 'mk-opt-' + matches[active].tid : '');
        };
        const close = () => {
          lb.hidden = true;
          input.setAttribute('aria-expanded', 'false');
          input.removeAttribute('aria-activedescendant');
        };
        const highlight = (i) => {
          const opts = lb.querySelectorAll('[role=option]');
          if (!opts.length) {
            return;
          }
          active = (i + opts.length) % opts.length;
          opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === active)));
          opts[active].scrollIntoView({ block: 'nearest' });
          input.setAttribute('aria-activedescendant', opts[active].id);
        };
        const add = (tid) => {
          if (A.cc.indexOf(tid) < 0) {
            A.cc.push(tid);
          }
          A.where = 'countries';
          flow.querySelectorAll('[data-where]').forEach((c) => c.setAttribute('aria-pressed', 'false'));
          input.value = '';
          drawTokens();
          render();
          close();
          if (phone.matches) {
            input.blur();
          }
        };
        tokens.addEventListener('click', (ev) => {
          const t = ev.target.closest('.mk-token');
          if (!t) {
            return;
          }
          A.cc = A.cc.filter((c) => c !== Number(t.dataset.cc));
          if (!A.cc.length && A.where === 'countries') {
            A.where = '';
          }
          drawTokens();
          render();
          input.focus();
        });
        input.addEventListener('input', search);
        input.addEventListener('focus', search);
        input.addEventListener('keydown', (ev) => {
          if (ev.key === 'ArrowDown') {
            ev.preventDefault();
            if (lb.hidden) {
              search();
            }
            else {
              highlight(active + 1);
            }
          }
          else if (ev.key === 'ArrowUp') {
            ev.preventDefault();
            highlight(active - 1);
          }
          else if (ev.key === 'Enter') {
            ev.preventDefault();
            if (active > -1 && matches[active]) {
              add(matches[active].tid);
            }
          }
          else if (ev.key === 'Escape') {
            close();
          }
          else if (ev.key === 'Backspace' && !input.value && A.cc.length) {
            A.cc.pop();
            if (!A.cc.length) {
              A.where = '';
            }
            drawTokens();
            render();
          }
        });
        lb.addEventListener('mousedown', (ev) => {
          const o = ev.target.closest('[role=option]');
          if (o) {
            ev.preventDefault();
            add(Number(o.dataset.cc));
          }
        });
        input.addEventListener('blur', () => setTimeout(close, 120));

        open(2, false);
        open(3, false);
        open(4, false);
        render();
      });
    },
  };
})(Drupal, once);

/**
 * Main menu: items with a submenu (Moving to the EU, Recruiting from India,
 * Events) go to their page when clicked. ECL's menu script opens the submenu
 * on that click instead; the chevron next to the item still opens it.
 */
(function () {
  'use strict';

  document.addEventListener('click', (event) => {
    const link = event.target.closest('.ecl-menu__item--has-children > .ecl-menu__link[href]');
    if (link && !event.defaultPrevented && event.button === 0) {
      // Stop ECL's handler (it runs later, on the link); the browser follows the link.
      event.stopImmediatePropagation();
    }
  }, true);
})();

/**
 * "Ask the Gateway" chat: sends the question to /elgo/ask and shows the FAQ
 * answer, "did you mean" choices, or the contact form when there is no
 * answer. Rules-based; the conversation stays in the page.
 */
(function (Drupal, once) {
  'use strict';

  // Photos in a rich text with Display "Photo carousel" (elgo_core Style):
  // one photo at a time, a caption (the photo's alternative text) and dots.
  Drupal.behaviors.elgoPhotos = {
    attach(context) {
      once('elgo-photos', '.elgo-style--photos > .ecl', context).forEach((stage) => {
        const slides = [...stage.querySelectorAll(':scope > article')];
        if (!slides.length) {
          return;
        }
        const cap = document.createElement('p');
        cap.className = 'elgo-photos__cap';
        cap.setAttribute('aria-hidden', 'true');
        stage.appendChild(cap);
        let current = 0;
        let timer = null;
        const dots = document.createElement('div');
        dots.className = 'elgo-photos__dots';
        dots.setAttribute('role', 'group');
        dots.setAttribute('aria-label', Drupal.t('Photos'));
        const show = (i) => {
          current = (i + slides.length) % slides.length;
          slides.forEach((s, n) => s.classList.toggle('is-on', n === current));
          const img = slides[current].querySelector('img');
          cap.textContent = img ? img.alt : '';
          cap.hidden = !cap.textContent;
          dots.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-current', String(n === current)));
        };
        if (slides.length > 1) {
          slides.forEach((s, n) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', Drupal.t('Photo @n', { '@n': n + 1 }));
            b.addEventListener('click', () => { show(n); clearInterval(timer); });
            dots.appendChild(b);
          });
          stage.after(dots);
          timer = setInterval(() => show(current + 1), 5000);
        }
        show(0);
      });
    },
  };

  Drupal.behaviors.elgoChat = {
    attach(context) {
      once('elgo-chat', '[data-elgo-chat]', context).forEach((chat) => {
        const log = chat.querySelector('.elgo-chat__log');
        const form = chat.querySelector('[data-elgo-chat-form]');
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        const contactUrl = chat.dataset.contactUrl;
        const faqUrl = chat.dataset.faqUrl;

        const message = (who) => {
          const div = document.createElement('div');
          div.className = 'elgo-chat__msg elgo-chat__msg--' + who;
          log.appendChild(div);
          div.scrollIntoView({ block: 'nearest' });
          return div;
        };
        const paragraph = (parent, text, className) => {
          const p = document.createElement('p');
          if (className) {
            p.className = className;
          }
          p.textContent = text;
          parent.appendChild(p);
          return p;
        };
        const link = (parent, href, text) => {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = text;
          parent.appendChild(a);
          return a;
        };
        // Questions offered as buttons: clicking one asks it.
        const choices = (parent, list, title) => {
          if (!list || !list.length) {
            return;
          }
          if (title) {
            paragraph(parent, title, 'elgo-chat__label');
          }
          const ul = document.createElement('ul');
          ul.className = 'elgo-chat__choices';
          list.forEach((item) => {
            const li = document.createElement('li');
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = item.question;
            b.addEventListener('click', () => ask(item.question));
            li.appendChild(b);
            ul.appendChild(li);
          });
          parent.appendChild(ul);
        };
        const contact = (parent) => {
          const p = paragraph(parent, Drupal.t('You can send it to us and we will reply:') + ' ', '');
          link(p, contactUrl, Drupal.t('Contact form'));
        };
        // Pages of the site (or official sites) to read.
        const pages = (parent, list, title) => {
          if (!list || !list.length) {
            return;
          }
          if (title) {
            paragraph(parent, title, 'elgo-chat__label');
          }
          const ul = document.createElement('ul');
          ul.className = 'elgo-chat__pages';
          list.forEach((item) => {
            const li = document.createElement('li');
            const a = link(li, item.url, item.section ? item.title + ' › ' + item.section : item.title);
            if (/^https?:/.test(item.url)) { a.target = '_blank'; a.rel = 'noopener'; }
            ul.appendChild(li);
          });
          parent.appendChild(ul);
        };

        // The conversation, kept while moving between pages (session only):
        // the questions, the answers as received, the country and the topic
        // the next question may refer to.
        const KEY = 'elgo-chat';
        let state = { log: [], country: '', topic: '' };
        try { state = Object.assign(state, JSON.parse(sessionStorage.getItem(KEY) || '{}')); } catch (e) { /* Storage blocked or invalid. */ }
        const save = () => {
          state.log = state.log.slice(-20);
          try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* Storage blocked or full. */ }
        };

        const render = (reply, data) => {
          if (data.status === 'answer' && data.source === 'site') {
            const head = paragraph(reply, '', 'elgo-chat__q');
            const a = link(head, data.url, data.section ? data.title + ' › ' + data.section : data.title);
            if (data.external) { a.target = '_blank'; a.rel = 'noopener'; }
            const answer = document.createElement('blockquote');
            answer.className = 'elgo-chat__answer elgo-chat__quote';
            // Filtered on the server (simple markup only).
            answer.innerHTML = data.answer;
            answer.querySelectorAll('a[href^="http"]').forEach((x) => { x.target = '_blank'; x.rel = 'noopener'; });
            reply.appendChild(answer);
            paragraph(reply, data.external ? Drupal.t('From an official source listed on the Gateway.') : Drupal.t('Quoted from this Gateway page.') + (data.ai ? ' ' + Drupal.t('This page was drafted with AI and is being reviewed.') : ''), 'elgo-chat__src');
            pages(reply, data.pages, Drupal.t('Also relevant'));
            choices(reply, data.related, Drupal.t('Related questions'));
          }
          else if (data.status === 'answer') {
            paragraph(reply, data.question, 'elgo-chat__q');
            const answer = document.createElement('div');
            answer.className = 'elgo-chat__answer';
            // Filtered on the server (simple markup only).
            answer.innerHTML = data.answer;
            answer.querySelectorAll('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener'; });
            reply.appendChild(answer);
            choices(reply, data.related, Drupal.t('Related questions'));
            pages(reply, data.pages, Drupal.t('Read more on the Gateway'));
            const more = paragraph(reply, '', 'elgo-chat__more');
            link(more, faqUrl, Drupal.t('See all questions'));
          }
          else if (data.status === 'suggest') {
            paragraph(reply, data.message);
            choices(reply, data.related);
            pages(reply, data.pages, Drupal.t('Pages that may help'));
            contact(reply);
          }
          else {
            paragraph(reply, data.message);
            contact(reply);
          }
        };

        // The conversation so far, and a way to start a new one.
        const reset = document.createElement('button');
        reset.type = 'button';
        reset.className = 'elgo-chat__reset';
        reset.textContent = Drupal.t('New conversation');
        reset.hidden = !state.log.length;
        reset.addEventListener('click', () => {
          state = { log: [], country: '', topic: '' };
          save();
          log.querySelectorAll('.elgo-chat__msg:not(:first-child)').forEach((m) => m.remove());
          reset.hidden = true;
          input.focus();
        });
        log.after(reset);
        state.log.forEach((entry) => {
          message('user').textContent = entry.q;
          render(message('bot'), entry.data);
        });
        log.scrollTop = log.scrollHeight;

        const ask = (question) => {
          question = question.trim();
          if (!question) {
            return;
          }
          message('user').textContent = question;
          const reply = message('bot');
          reply.classList.add('is-loading');
          reply.textContent = Drupal.t('Looking for an answer…');
          button.disabled = true;
          // The country and topic of the conversation, for follow-ups.
          const params = new URLSearchParams({ q: question });
          if (state.country) { params.set('country', state.country); }
          if (state.topic) { params.set('prev', state.topic); }
          fetch(chat.dataset.askUrl + '?' + params.toString(), { headers: { Accept: 'application/json' } })
            .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
            .then((data) => {
              reply.classList.remove('is-loading');
              reply.textContent = '';
              render(reply, data);
              state.log.push({ q: question, data });
              state.country = data.country || state.country;
              state.topic = data.topic || question;
              save();
              reset.hidden = false;
              reply.scrollIntoView({ block: 'start' });
            })
            .catch(() => {
              reply.classList.remove('is-loading');
              reply.textContent = '';
              paragraph(reply, Drupal.t('Sorry, something went wrong. Please try again.'));
              contact(reply);
            })
            .finally(() => {
              button.disabled = false;
              input.focus();
            });
        };

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          ask(input.value);
          input.value = '';
        });
      });
    },
  };
})(Drupal, once);

/**
 * Links to #elgo-assistant-panel (e.g. "Ask a question" on the homepage)
 * open the "Ask the Gateway" assistant instead of jumping to it.
 */
(function () {
  'use strict';

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href="#elgo-assistant-panel"]');
    const panel = document.getElementById('elgo-assistant-panel');
    if (!link || !panel) {
      return;
    }
    event.preventDefault();
    if (panel.hidden) {
      document.querySelector('.elgo-assistant__launcher')?.click();
    }
    document.getElementById('elgo-assistant-q')?.focus();
  });
})();
