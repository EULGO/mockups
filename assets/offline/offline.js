/* Offline copy: the Visa Wizard and EU Predict forms and links open the
   saved page for the same answers (see export-offline-site.py). */
(function () {
  var D = window.ELGO_OFFLINE_DATA, P = window.ELGO_OFFLINE || {};
  if (!D) return;
  var PLANS = ['qualified_job_offer', 'same_group_transfer', 'research_host', 'study_admission', 'job_search'];

  function key(pairs) {
    return pairs.filter(function (p) { return p[1] !== '' && p[0] !== 'save'; })
      .map(function (p) { return p[0] + '=' + p[1]; }).sort().join('&');
  }
  function note(host, html, cls) {
    var box = document.getElementById('elgo-offline-box');
    if (!box) {
      box = document.createElement('div');
      box.id = 'elgo-offline-box';
      host.insertBefore(box, host.firstChild);
    }
    box.className = cls || 'elgo-boxed elgo-offline';
    box.innerHTML = html;
    box.scrollIntoView({ block: 'start' });
  }

  /* ---------- Visa Wizard ---------- */
  function journeys(missing) {
    var by = {};
    D.journeys.forEach(function (j) { (by[j.country] = by[j.country] || []).push(j); });
    var list = Object.keys(by).map(function (c) {
      return '<li><strong>' + c + ':</strong> ' + by[c].map(function (j) { return '<a href="' + j.id + '-1.html">' + j.plan + '</a>'; }).join(' · ') + '</li>';
    }).join('');
    var host = document.querySelector('.elgo-wizard__main') || document.querySelector('.elgo-wizard .elgo-inner');
    note(host, '<p class="elgo-eyebrow-plain">Offline copy</p>' +
      (missing ? '<p><strong>This combination of answers is not saved in the offline copy.</strong> On step 1, choose one country and answer “Yes” to one plan only, or open a saved journey:</p>'
               : '<p>This offline copy has a complete journey for each country and plan, with sample answers on steps 2 and 3. Start from step 1, or open a journey directly:</p>') +
      '<ul>' + list + '</ul>');
  }
  function wizardGo(pairs) {
    var d = {};
    pairs.forEach(function (p) { d[p[0]] = p[1]; });
    if (d.step === '2') {
      PLANS.forEach(function (n) { if (!(n in d)) pairs.push([n, 'no']); });
      if (d.country_known === 'yes' && !('destination_offer' in d)) pairs.push(['destination_offer', 'yes']);
    }
    var file = D.wizard[key(pairs)];
    if (file) { location.href = file; return; }
    if (P.journey && d.step) { location.href = P.journey + '-' + d.step + '.html' + (Number(d.step) > P.step ? '?sample=1' : ''); return; }
    if (d.step === '1' && !d.country) { location.href = 'wizard-step-1.html'; return; }
    journeys(true);
  }

  /* ---------- EU Predict ---------- */
  function predictGo(pairs) {
    var file = D.predict[key(pairs)];
    if (file) { location.href = file + '#results'; return; }
    note(document.querySelector('.elgo-predict .elgo-inner'),
      '<p class="elgo-eyebrow-plain">Offline copy</p><p><strong>This combination of preferences is not saved in the offline copy.</strong> ' +
      'Saved here: no preference, or <strong>one</strong> choice in one filter (one destination, one qualification, one pathway category, one field of work…). ' +
      'Languages and the search box need the live site. <a href="candidates--eu-predict.html">Start again</a></p>', 'elgo-confirm');
  }

  function pairsOf(form, submitter) {
    var pairs = [];
    new FormData(form, submitter).forEach(function (v, k) { pairs.push([k, String(v)]); });
    if (submitter && submitter.name) {
      pairs = pairs.filter(function (p) { return p[0] !== submitter.name; });
      pairs.push([submitter.name, submitter.value]);
    }
    return pairs;
  }
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form.closest('.elgo-wizard')) { e.preventDefault(); wizardGo(pairsOf(form, e.submitter)); }
    else if (form.id === 'elgo-predict-form') { e.preventDefault(); predictGo(pairsOf(form, e.submitter)); }
  }, true);
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-href]');
    if (!a) return;
    var href = a.getAttribute('data-href');
    var tool = href.indexOf('/visa-wizard') >= 0 ? 'w' : href.indexOf('/eu-predict') >= 0 ? 'p' : '';
    if (!tool) return;
    e.preventDefault();
    var pairs = [];
    new URLSearchParams(href.split('#')[0].split('?')[1] || '').forEach(function (v, k) { pairs.push([k, v]); });
    if (tool === 'w') {
      if (!pairs.length) { location.href = 'candidates--visa-wizard.html'; return; }
      wizardGo(pairs);
    }
    else {
      var has = function (n) { return pairs.some(function (p) { return p[0] === n; }); };
      if (!pairs.length || has('clear')) { location.href = 'candidates--eu-predict.html'; return; }
      if (!has('sort')) pairs.push(['sort', 'updated']);
      if (!has('view')) pairs.push(['view', 'board']);
      predictGo(pairs);
    }
  }, true);

  var main = document.querySelector('.elgo-wizard__main');
  if (main && /[?&]sample=1/.test(location.search)) {
    var n = document.createElement('p');
    n.className = 'elgo-confirm';
    n.textContent = 'Offline copy: the answers of the previous step are not evaluated here. This page shows the result for the sample answers of this journey.';
    main.insertBefore(n, main.firstChild);
  }
  if (P.page === 'candidates--visa-wizard.html') journeys(false);
})();
