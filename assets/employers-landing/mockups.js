/* ELGO mockups: shared page parts for the starter, personal and recruiter pages.
   Pages mark slots with data-part="…" and this file fills them (in Drupal these
   would be Twig includes / blocks). Works from file:// (no fetch).
   Based on audience/homepage-variants/shared.js; the footer follows the starter
   spec (eu-india-gateway-spec.md §3.4). */
(function () {
  "use strict";

  var PAGES = [
    { id: "starter", file: "../home.html", name: "Home" },
    { id: "personal", file: "../candidates/moving-to-the-eu.html", name: "Moving to the EU" },
    { id: "recruiter", file: "recruiter.html", name: "For Employers and Higher Education Institutions" }
  ];

  var parts = {
    /* mockup chrome, not part of the design */
    bar: function () {
      var cur = document.body.getAttribute("data-page");
      return '<div class="rv-bar" role="note" aria-label="Mockup navigation"><div class="ecl-container">' +
        "<span><strong>ELGO mockups</strong> · Soft EU theme</span>" +
        '<nav aria-label="Mockup pages">' +
        PAGES.map(function (p) {
          if (p.soon) return '<a aria-disabled="true" style="opacity:.5;pointer-events:none">' + p.name + " (to do)</a>";
          return '<a href="' + p.file + '"' + (p.id === cur ? ' aria-current="page"' : "") + ">" + p.name + "</a>";
        }).join("") + "</nav></div></div>";
    },

    header: function () {
      var nav = document.body.getAttribute("data-nav");
      function item(id, href, label) {
        return '<li><a href="' + href + '"' + (nav === id ? ' aria-current="page"' : "") + ">" + label + "</a></li>";
      }
      return '<header class="elgo-header"><div class="ecl-container">' +
        '<div class="elgo-header__top">' +
        '<a class="elgo-header__logo" href="../home.html"><img src="../assets/employers-landing/img/logo.png" alt="EU–India Legal Gateway, home"></a>' +
        '<div class="elgo-header__tools">' +
        '<a class="elgo-header__lang" href="#"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>EN</a>' +
        '<form class="elgo-header__search" role="search" onsubmit="return false"><input id="site-search" type="search" aria-label="Search the Gateway" placeholder="Search the Gateway"><button type="submit" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg></button></form>' +
        "</div></div>" +
        /* "About" stays out of the main nav for now (process/decisions-log.md) */
        '<nav class="elgo-nav" aria-label="Main"><ul>' +
        item("personal", "../candidates/moving-to-the-eu.html", "Moving to the EU") + item("recruiter", "recruiter.html", "Recruiting from India") +
        item("countries", "../countries/countries.html", "Countries") + item("guides", "#", "Guides") + item("events", "#", "Events") +
        "</ul></nav></div></header>";
    },

    /* page information (spec §5.2 J) + the ECL site footer, core (EC preset 5.3.1 markup,
       https://ec.europa.eu/component-library/ec/components/site-wide/site-footer/code/),
       configured as the user's reference: feedback row, site info + six links, legal row.
       Background from the theme (see .ecl-site-footer in mockups.css). */
    footer: function () {
      return '<div class="elgo-meta"><div class="ecl-container"><span>Last reviewed: <strong>12 September 2026</strong></span><span>Content owner: <strong>ICMPD Gateway editorial team</strong></span><a class="ecl-link" href="#">Give feedback on this page</a></div></div>' +
        '<footer class="ecl-site-footer"><div class="ecl-site-footer__main"><div class="ecl-container ecl-site-footer__container">' +
        '<div class="ecl-site-footer__row"><div class="ecl-site-footer__section ecl-site-footer__section--feedback">' +
        '<div class="ecl-site-footer__description">Help us improve the Gateway</div>' +
        '<a href="#" class="ecl-link ecl-link--primary-highlight-inverted ecl-link--icon ecl-site-footer__action-button ecl-button--m"><span class="ecl-link__label">Fill in survey</span><svg class="ecl-icon ecl-icon--m ecl-link__icon" viewBox="0 0 256 256" width="48" height="48" aria-hidden="true" focusable="false"><line x1="64" y1="192" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="88 64 192 64 192 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg><span class="elgo-sr">(external survey)</span></a>' +
        "</div></div>" +
        '<div class="ecl-site-footer__row ecl-site-footer__row--specific">' +
        '<div class="ecl-site-footer__section ecl-site-footer__section--site-info">' +
        '<a href="https://european-union.europa.eu/index_en" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__logo-link"><picture class="ecl-picture ecl-site-footer__picture"><img class="ecl-site-footer__logo-image mk-footer-flag" src="../assets/employers-landing/img/eu-flag.svg" alt="European Union flag"></picture></a>' +
        '<div class="ecl-site-footer__description">A European Union initiative implemented by:<span class="ecl-site-footer__description-name">ICMPD</span></div>' +
        "</div>" +
        '<div class="ecl-site-footer__section ecl-site-footer__section--core"><ul class="ecl-site-footer__list">' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">About this site</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html#who-runs-it" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Who runs it</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html#how-it-works" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">How it works</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Contact us</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Sitemap</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Report an error</a></li>' +
        "</ul></div></div>" +
        '<div class="ecl-site-footer__row ecl-site-footer__row--common"><div class="ecl-site-footer__section ecl-site-footer__section--common"><ul class="ecl-site-footer__list ecl-site-footer__list--inline">' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Cookies</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Privacy policy</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Legal notice</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Accessibility</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--inverted ecl-site-footer__link">Language policy</a></li>' +
        "</ul></div></div>" +
        "</div></div></footer>";
    }
  };

  /* L5's hero slideshow: autoplay every 5 s (a plain fade with reduced motion),
     dots, a Pause button, pauses on hover; one caption per photo. */
  function slideshow(stageSel) {
    var stage = document.querySelector(stageSel);
    if (!stage) return;
    var slides = stage.querySelectorAll(".mk-slides img"), dots = stage.querySelector(".mk-dots"), cap = stage.querySelector(".mk-cap");
    var cur = 0, timer = null, paused = false;
    slides.forEach(function (_, i) { dots.insertAdjacentHTML("beforeend", '<button type="button" aria-label="Photo ' + (i + 1) + " of " + slides.length + '"' + (i ? "" : ' aria-current="true"') + "></button>"); });
    dots.insertAdjacentHTML("beforeend", '<button type="button" class="mk-pause" aria-pressed="false">Pause</button>');
    var dotBtns = dots.querySelectorAll("button:not(.mk-pause)"), pauseBtn = dots.querySelector(".mk-pause");
    function go(i) {
      slides[cur].classList.remove("is-on"); dotBtns[cur].removeAttribute("aria-current");
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add("is-on"); dotBtns[cur].setAttribute("aria-current", "true");
      if (cap) cap.textContent = slides[cur].dataset.cap;
    }
    function stop() { clearInterval(timer); timer = null; }
    function start() { stop(); if (!paused) timer = setInterval(function () { go(cur + 1); }, 5000); }
    dotBtns.forEach(function (b, i) { b.addEventListener("click", function () { go(i); start(); }); });
    pauseBtn.addEventListener("click", function () { paused = !paused; pauseBtn.setAttribute("aria-pressed", String(paused)); pauseBtn.textContent = paused ? "Play" : "Pause"; start(); });
    stage.addEventListener("mouseenter", stop); stage.addEventListener("mouseleave", start);
    start();
  }
  window.mkSlideshow = slideshow;

  function render() {
    document.querySelectorAll("[data-part]").forEach(function (el) {
      var fn = parts[el.getAttribute("data-part")];
      if (fn) el.outerHTML = fn();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
