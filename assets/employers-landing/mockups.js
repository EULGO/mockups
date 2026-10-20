/* ELGO mockups: shared page parts for the starter, personal and recruiter pages.
   Pages mark slots with data-part="…" and this file fills them (in Drupal these
   would be Twig includes / blocks). Works from file:// (no fetch).
   Based on archive/audience/homepage-variants/shared.js; the footer follows the starter
   spec (eu-india-gateway-spec.md §3.4). */
(function () {
  "use strict";

  var PAGES = [
    { id: "starter", file: "../home.html", name: "Home" },
    { id: "personal", file: "../candidates/moving-to-the-eu.html", name: "Moving to the EU" },
    { id: "recruiter", file: "recruiter.html", name: "For Employers and Higher Education Institutions" },
    { id: "predict", file: "eu-predict.html", name: "EU Predict" },
    { id: "wizard", file: "visa-wizard.html", name: "Visa wizard" }
  ];

  /* ---------- Site menu (6 Oct 2026) ----------
     Built from resources/site_map_30-09-2026.md, split by audience the way make-it-in-germany.com
     does: an audience bar (home = starter page, "Moving to the EU", "Recruiting from India") and,
     under the logo, the main menu of that audience. Countries, Resources and Events are shared
     pages: they sit in both menus with the same items, only the resource links carry the audience
     filter. A page sets <body data-audience="candidate | employer | home | shared">; "home" and
     "shared" pages show the audience remembered from this visit (sessionStorage), else the
     candidate menu. <body data-menu="…"> marks the current menu item.
     The menu is ECL's Menu (EC preset 5.3.1 markup and CSS: ecl-menu, ecl-menu__item--col1/col2,
     ecl-menu__mega); the small script at the end of this file stands in for ECL's JS. Fast-follow
     pages (job platforms, Learning Hub, institutional signposting, success stories) are left out
     for now: see mockups/README.md for where they slot in. */
  var AUD = {
    candidate: { name: "Moving to the EU", href: "../candidates/moving-to-the-eu.html", filter: "candidates" },
    employer: { name: "Recruiting from India", href: "recruiter.html", filter: "employers" }
  };
  function shared(aud) {
    return [
      /* the list of 10 countries is still to come from the client; the five used in the mockups so far */
      { id: "countries", label: "Countries", href: "../countries/countries.html", col: "col2", items: [["EU-level information", "#"], ["Austria", "../countries/austria.html"], ["France", "../countries/france.html"], ["Germany", "../countries/germany.html"], ["Netherlands", "../countries/netherlands.html"], ["Spain", "../countries/spain.html"]] },
      { id: "resources", label: "Resources", href: "#", items: [["All resources", "#?audience=" + AUD[aud].filter], ["Official source directory", "#?audience=" + AUD[aud].filter]] },
      /* "News & Events", not the sitemap's "Events": the client's email of 2 Oct (after the sitemap) asked for it */
      { id: "events", label: "News &amp; Events", href: "#", items: [["News", "#"], ["Upcoming events", "#"], ["Past events", "#"]] }
    ];
  }
  /* Synced with the Figma Site header (ELGO - Custom theme, 14 Oct 2026): no Guidance item; the
     audience's direct links (tool: true) come first, in brand blue and without a dropdown, then the
     shared dropdowns. Guidance pages stay reachable from the landing pages' sections. */
  var MENU = {
    candidate: [
      { id: "predict", label: "EU Predict", href: "eu-predict.html", tool: true },
      { id: "wizard", label: "Visa wizard", href: "visa-wizard.html", tool: true }
    ].concat(shared("candidate")),
    employer: [
      { id: "lmi", label: "Labour-market intelligence", href: "recruiter.html#market", tool: true }
    ].concat(shared("employer"))
  };

  function audience() {
    var a = document.body.getAttribute("data-audience");
    if (AUD[a]) { try { sessionStorage.setItem("elgo-audience", a); } catch (e) {} return a; }
    try { a = sessionStorage.getItem("elgo-audience"); } catch (e) { a = null; }
    return AUD[a] ? a : "candidate";
  }

  var ICON = {
    home: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor"/></svg>',
    menu: '<svg class="ecl-icon ecl-icon--m ecl-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    close: '<svg class="ecl-icon ecl-icon--m ecl-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    caret: '<svg class="ecl-icon ecl-icon--xs ecl-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    back: '<svg class="ecl-icon ecl-icon--s ecl-button__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m15 6-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  function searchForm(id, cls) {
    return '<form class="' + cls + '" role="search" onsubmit="return false"><input id="' + id + '" type="search" aria-label="Search the Gateway" placeholder="Search the Gateway"><button type="submit" aria-label="Search">' + ICON.search + "</button></form>";
  }

  function menuItem(it, cur) {
    var on = it.id === cur, kids = it.items && it.items.length;
    return '<li class="ecl-menu__item' + (kids ? " ecl-menu__item--has-children ecl-menu__item--" + (it.col || "col1") : "") + (it.tool ? " elgo-menu__item--tool" : "") +
      (on ? " ecl-menu__item--current" : "") + '" data-ecl-menu-item' + (kids ? ' aria-haspopup="true"' : "") + ">" +
      '<a href="' + it.href + '" class="ecl-menu__link" data-ecl-menu-link' + (on ? ' aria-current="page"' : "") + ">" + it.label + "</a>" +
      (kids ? '<button class="ecl-button ecl-button--tertiary ecl-menu__button-caret ecl-button--icon-only" type="button" data-ecl-menu-caret aria-expanded="false"><span class="ecl-button__container">' + ICON.caret + '<span class="ecl-button__label elgo-sr">' + it.label + ": show pages</span></span></button>" +
        '<div class="ecl-menu__mega" data-ecl-menu-mega><ul class="ecl-menu__sublist">' +
        it.items.map(function (s) { return '<li class="ecl-menu__subitem"><a href="' + s[1] + '" class="ecl-menu__sublink">' + s[0] + "</a></li>"; }).join("") +
        "</ul></div>" : "") + "</li>";
  }

  var parts = {
    /* mockup chrome, not part of the design: the page selector above the header. Taken off the
       pages on 6 Oct 2026 (not needed for now); to bring it back, put <div data-part="bar"></div>
       before the header slot on each page. */
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
      var page = document.body.getAttribute("data-audience"), aud = audience(), cur = document.body.getAttribute("data-menu");
      function tab(id, href, label, cls) {
        /* the landing page itself is the "page"; its tools and shared pages only mark the section */
        var on = id === page || (id === aud && page !== "home"), here = AUD[id] ? id === page && cur === null : page === "home";
        return '<li><a class="' + (cls || "") + (on ? " is-on" : "") + '" href="' + href + '"' + (on ? ' aria-current="' + (here ? "page" : "true") + '"' : "") + ">" + label + "</a></li>";
      }
      var util = '<li><a href="#">About</a></li><li><a href="#">FAQ</a></li><li><a href="#">Contact</a></li>';
      return '<header class="elgo-header">' +
        /* audience bar; no language switch: the site is English only (process/decisions-log.md).
           About, FAQ and Contact sit on its right, so About stays out of the main menu. */
        '<div class="elgo-aud"><div class="ecl-container elgo-aud__in">' +
        '<nav class="elgo-aud__tabs" aria-label="Who the Gateway is for"><ul>' +
        tab("home", "../home.html", ICON.home + '<span class="elgo-sr">Home</span>', "elgo-aud__home") +
        tab("candidate", AUD.candidate.href, AUD.candidate.name) + tab("employer", AUD.employer.href, AUD.employer.name) +
        "</ul></nav>" +
        '<nav class="elgo-aud__util" aria-label="About the Gateway"><ul>' + util + "</ul></nav>" +
        "</div></div>" +
        '<div class="ecl-container"><div class="elgo-header__top">' +
        '<a class="elgo-header__logo" href="../home.html"><img src="../assets/employers-landing/img/logo.png" alt="EU–India Legal Gateway, home"></a>' +
        '<div class="elgo-header__tools">' + searchForm("site-search", "elgo-header__search") +
        '<button class="ecl-button ecl-button--tertiary elgo-menu-open" type="button" aria-expanded="false" aria-controls="elgo-menu-inner"><span class="ecl-button__container">' + ICON.menu + '<span class="ecl-button__label">Menu</span></span></button>' +
        "</div></div></div>" +
        '<nav class="ecl-menu elgo-menu" aria-label="Main: ' + AUD[aud].name + '" data-ecl-menu>' +
        '<div class="ecl-menu__overlay"></div>' +
        '<div class="ecl-container ecl-menu__container">' +
        '<section class="ecl-menu__inner" id="elgo-menu-inner" aria-label="Menu">' +
        '<header class="ecl-menu__inner-header">' +
        '<button class="ecl-button ecl-button--tertiary ecl-menu__back" type="button"><span class="ecl-button__container">' + ICON.back + '<span class="ecl-button__label">Back</span></span></button>' +
        '<div class="ecl-menu__title">' + AUD[aud].name + "</div>" +
        '<button class="ecl-button ecl-button--tertiary ecl-menu__close" type="button"><span class="ecl-button__container">' + ICON.close + '<span class="ecl-button__label">Close</span></span></button>' +
        "</header>" +
        searchForm("menu-search", "elgo-menu__search") +
        '<ul class="ecl-menu__list">' + MENU[aud].map(function (it) { return menuItem(it, cur); }).join("") + "</ul>" +
        '<ul class="elgo-menu__util" aria-label="About the Gateway">' + util + "</ul>" +
        "</section></div></nav></header>";
    },

    /* Newsletter sign-up, the last section of each homepage (client request; "Newsletter subscribe
       form" in the sitemap, 6 Oct 2026): an email field with Subscribe, then the double opt-in
       message. Rows: title; description beside the field; promises and the privacy link. One newsletter, no choice of lists (6 Oct). */
    newsletter: function () {
      return '<section class="mk-news" id="newsletter" aria-labelledby="news-title">' +
        /* a segment of the hero arches (same paths as the starter cards and the recruiter header), in --news-ring */
        '<svg class="mk-news__arcs" viewBox="0 0 500 540" aria-hidden="true" focusable="false"><g opacity=".3"><path d="M32 470 V250 A218 218 0 0 1 384.2 78.2"/><path d="M430.7 128.1 A218 218 0 0 1 468.0 250.0 V540"/><circle cx="32" cy="470" r="9"/><circle cx="430.7" cy="128.1" r="9"/></g><g opacity=".55"><path d="M55 540 V250 A195 195 0 0 1 69.2 177.0"/><path d="M100.6 124.7 A195 195 0 0 1 445.0 250.0 V440"/><circle cx="445" cy="440" r="9"/><circle cx="100.6" cy="124.7" r="9"/></g><g opacity=".85"><path d="M78 500 V250 a172 172 0 0 1 344 0 V540"/><circle cx="78" cy="500" r="9"/></g></svg>' +
        '<div class="ecl-container mk-news__in">' +
        '<h2 class="mk-news__h" id="news-title">Stay up to date with our newsletter</h2>' +
        "<p>New pathways, changes to the rules and upcoming sessions, sent by the EU–India Legal Gateway. Free, and only verified information.</p>" +
        '<form class="mk-news__panel" novalidate>' +
        '<div class="mk-news__form">' +
        '<label class="elgo-sr" for="nl-email">Your email address</label>' +
        '<input class="mk-news__email" id="nl-email" type="email" autocomplete="email" placeholder="Your email address" aria-describedby="nl-email-err">' +
        '<p class="mk-news__err" id="nl-email-err" hidden></p>' +
        '<button class="ecl-button ecl-button--primary ecl-button--highlight mk-news__go" type="submit">Subscribe</button>' +
        "</div>" +
        '<div class="mk-news__done" hidden tabindex="-1">' +
        '<span class="mk-news__tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<h3>Check your inbox</h3><p>We sent a confirmation link to <b class="mk-news__addr"></b>. Your subscription starts when you open it.</p>' +
        '<button class="mk-link mk-news__again" type="button">Use a different address</button>' +
        "</div>" +
        "</form>" +
        '<ul class="mk-news__points"><li>Unsubscribe at any time</li><li>We never share your address</li><li class="mk-news__privacy"><a href="#">Privacy notice</a></li></ul>' +
        "</div></section>";
    },

    /* page information (spec §5.2 J), Figma's "Page meta". Its own part since 14 Oct 2026: the
       homepages no longer show it (removed from their Figma layouts), the Visa wizard still does;
       to show it on a page, put <div data-part="meta"></div> just before the footer. */
    meta: function () {
      return '<div class="elgo-meta"><div class="ecl-container"><span>Last reviewed: <strong>12 September 2026</strong></span><span>Content owner: <strong>ICMPD Gateway editorial team</strong></span><a class="ecl-link" href="#">Give feedback on this page</a></div></div>';
    },

    /* the ECL site footer, core (EC preset 5.3.1 markup,
       https://ec.europa.eu/component-library/ec/components/site-wide/site-footer/code/),
       configured as the user's reference: feedback row, site info + six links, legal row.
       Background from the theme (see .ecl-site-footer in mockups.css). */
    footer: function () {
      return '<footer class="ecl-site-footer"><div class="ecl-site-footer__main"><div class="ecl-container ecl-site-footer__container">' +
        /* feedback row ("Help us improve the Gateway" + "Fill in survey") hidden for now (30 Sept 2026);
           remove the style attribute to show it again */
        '<div class="ecl-site-footer__row" style="display: none"><div class="ecl-site-footer__section ecl-site-footer__section--feedback">' +
        '<div class="ecl-site-footer__description">Help us improve the Gateway</div>' +
        '<a href="#" class="ecl-link ecl-link--primary-highlight-inverted ecl-link--icon ecl-site-footer__action-button ecl-button--m"><span class="ecl-link__label">Fill in survey</span><svg class="ecl-icon ecl-icon--m ecl-link__icon" viewBox="0 0 256 256" width="48" height="48" aria-hidden="true" focusable="false"><line x1="64" y1="192" x2="192" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline points="88 64 192 64 192 168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg><span class="elgo-sr">(external survey)</span></a>' +
        "</div></div>" +
        '<div class="ecl-site-footer__row ecl-site-footer__row--specific">' +
        '<div class="ecl-site-footer__section ecl-site-footer__section--site-info">' +
        /* funder and implementer lockup (client feedback 25 Sept, #4.1): the landing page's block
           (eu-legal-gateway.eu), same wording, order and logos, redrawn to sit in the footer.
           A funding visibility requirement: keep it on every page and legible on mobile. */
        '<ul class="mk-lockup" aria-label="Funding and implementation">' +
        '<li><span class="mk-lockup__label">Funded by the European Union</span><a href="https://european-union.europa.eu/index_en"><img class="mk-lockup__flag" src="../assets/employers-landing/img/eu-flag.svg" alt="European Union flag" width="72" height="48"></a></li>' +
        '<li><span class="mk-lockup__label">In the framework of</span><a href="https://www.migrationpartnershipfacility.eu/"><img src="../assets/employers-landing/img/partners/mpf.png" alt="Migration Partnership Facility (MPF)" width="359" height="156"></a></li>' +
        '<li><span class="mk-lockup__label">Implemented by</span><a href="https://www.icmpd.org/"><img src="../assets/employers-landing/img/partners/icmpd.png" alt="International Centre for Migration Policy Development (ICMPD)" width="490" height="170"></a></li>' +
        "</ul>" +
        "</div>" +
        '<div class="ecl-site-footer__section ecl-site-footer__section--core"><ul class="ecl-site-footer__list">' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html" class="ecl-link ecl-link--standalone ecl-site-footer__link">About this site</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html#who-runs-it" class="ecl-link ecl-link--standalone ecl-site-footer__link">Who runs it</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="../about.html#how-it-works" class="ecl-link ecl-link--standalone ecl-site-footer__link">How it works</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Contact us</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Sitemap</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Report an error</a></li>' +
        "</ul></div></div>" +
        '<div class="ecl-site-footer__row ecl-site-footer__row--common"><div class="ecl-site-footer__section ecl-site-footer__section--common">' +
        /* social media follow above the legal links, placed as in the ECL harmonised footer
           (story components-site-wide-site-footer--harmonised: "Follow the European Commission" + icons);
           LinkedIn and YouTube only (client feedback 25 Sept, #4.2). Links to the Office's channels still to come. */
        '<div class="ecl-site-footer__extra-links-container"><div class="ecl-social-media-follow ecl-social-media-follow--left ecl-social-media-follow--description_inline ecl-site-footer__social-media mk-social"><p class="ecl-social-media-follow__description">Follow us</p><ul class="ecl-social-media-follow__list">' +
        '<li class="ecl-social-media-follow__item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--icon ecl-social-media-follow__link"><svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" class="ecl-icon ecl-icon--xs ecl-link__icon ecl-social-media-follow__icon ecl-icon-networks--linkedin" width="48" height="48"><path fill="currentColor" d="M42.74 2.003H5.247A3.21 3.21 0 0 0 2 5.175v37.65A3.213 3.213 0 0 0 5.247 46H42.74A3.22 3.22 0 0 0 46 42.825V5.172A3.218 3.218 0 0 0 42.74 2"/><path fill="#fff" d="M31.295 17.778c6.506 0 7.705 4.286 7.705 9.863L38.997 39H32.58V28.6c-.01-2.345-.193-5.161-3.338-5.161-3.266 0-3.830 2.496-3.854 5.129v10.431h-6.42V18.293h6.162v2.83h.087a6.75 6.75 0 0 1 6.08-3.345Zm-16.36.515V39H8.509V18.293h6.426ZM11.725 8a3.728 3.728 0 0 1 3.724 3.73c0 .99-.392 1.94-1.09 2.64a3.721 3.721 0 0 1-2.634 1.093A3.728 3.728 0 0 1 8 11.732 3.728 3.728 0 0 1 11.724 8Z"/></svg><span class="ecl-link__label">LinkedIn</span></a></li>' +
        '<li class="ecl-social-media-follow__item"><a href="#" class="ecl-link ecl-link--standalone ecl-link--icon ecl-social-media-follow__link"><svg viewBox="0 0 461 461" aria-hidden="true" focusable="false" class="ecl-icon ecl-icon--xs ecl-link__icon ecl-social-media-follow__icon ecl-icon-networks--youtube" width="48" height="48"><path fill="currentColor" d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607c0-3.774,3.982-6.220,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"/></svg><span class="ecl-link__label">YouTube</span></a></li>' +
        "</ul></div></div>" +
        '<ul class="ecl-site-footer__list ecl-site-footer__list--inline">' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Cookies</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Privacy policy</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Legal notice</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Accessibility</a></li>' +
        '<li class="ecl-site-footer__list-item"><a href="#" class="ecl-link ecl-link--standalone ecl-site-footer__link">Language policy</a></li>' +
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

  /* Stand-in for ECL's Menu script, on ECL's own states: from 1140px (ECL's desktop breakpoint)
     a dropdown opens on hover or on its caret button (data-expanded on the item); below it the
     menu is a side panel (data-expanded on the nav) where a caret drills into the section
     (ecl-menu__inner--expanded + ecl-menu__item--expanded) and Back returns. Escape closes. */
  function menu() {
    var nav = document.querySelector(".elgo-menu");
    if (!nav) return;
    var inner = nav.querySelector(".ecl-menu__inner"), open = document.querySelector(".elgo-menu-open");
    var close = nav.querySelector(".ecl-menu__close"), back = nav.querySelector(".ecl-menu__back");
    var mq = window.matchMedia("(min-width: 1140px)");
    var items = [].slice.call(nav.querySelectorAll(".ecl-menu__item--has-children"));
    function caret(li) { return li.querySelector(".ecl-menu__button-caret"); }
    function setItem(li, on) {
      if (on) items.forEach(function (o) { if (o !== li) setItem(o, false); });
      li.setAttribute("data-expanded", on ? "true" : "false");
      caret(li).setAttribute("aria-expanded", String(on));
    }
    function drill(li) {
      inner.classList.toggle("ecl-menu__inner--expanded", !!li);
      items.forEach(function (o) { o.classList.toggle("ecl-menu__item--expanded", o === li); caret(o).setAttribute("aria-expanded", String(o === li)); });
      (li ? li.querySelector(".ecl-menu__link") : close).focus();
    }
    function panel(on) {
      if (on) { nav.setAttribute("data-expanded", ""); } else { nav.removeAttribute("data-expanded"); drill(null); }
      open.setAttribute("aria-expanded", String(on));
      document.documentElement.classList.toggle("elgo-menu-locked", on);
      (on ? close : open).focus();
    }
    items.forEach(function (li) {
      li.addEventListener("mouseenter", function () { if (mq.matches) setItem(li, true); });
      li.addEventListener("mouseleave", function () { if (mq.matches) setItem(li, false); });
      li.addEventListener("focusout", function (e) { if (mq.matches && !li.contains(e.relatedTarget)) setItem(li, false); });
      caret(li).addEventListener("click", function () {
        if (mq.matches) setItem(li, li.getAttribute("data-expanded") !== "true");
        else drill(li);
      });
    });
    open.addEventListener("click", function () { panel(!nav.hasAttribute("data-expanded")); });
    close.addEventListener("click", function () { panel(false); });
    nav.querySelector(".ecl-menu__overlay").addEventListener("click", function () { panel(false); });
    back.addEventListener("click", function () {
      var li = nav.querySelector(".ecl-menu__item--expanded");
      inner.classList.remove("ecl-menu__inner--expanded");
      if (li) { li.classList.remove("ecl-menu__item--expanded"); caret(li).setAttribute("aria-expanded", "false"); caret(li).focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var li = nav.querySelector('.ecl-menu__item[data-expanded="true"]');
      if (li) { setItem(li, false); caret(li).focus(); }
      else if (nav.hasAttribute("data-expanded")) panel(false);
    });
    document.addEventListener("click", function (e) {
      if (mq.matches && !nav.contains(e.target)) items.forEach(function (o) { setItem(o, false); });
    });
    mq.addEventListener("change", function () {
      items.forEach(function (o) { setItem(o, false); });
      if (nav.hasAttribute("data-expanded")) { nav.removeAttribute("data-expanded"); open.setAttribute("aria-expanded", "false"); document.documentElement.classList.remove("elgo-menu-locked"); }
      inner.classList.remove("ecl-menu__inner--expanded");
      items.forEach(function (o) { o.classList.remove("ecl-menu__item--expanded"); });
    });
  }

  function newsletter() {
    var form = document.querySelector(".mk-news__panel");
    if (!form) return;
    var email = form.querySelector("#nl-email"), eErr = form.querySelector("#nl-email-err");
    var step = form.querySelector(".mk-news__form"), done = form.querySelector(".mk-news__done");
    function err(msg) { eErr.textContent = msg || ""; eErr.hidden = !msg; email.toggleAttribute("aria-invalid", !!msg); }
    email.addEventListener("input", function () { if (!eErr.hidden && email.validity.valid && email.value) err(""); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = email.value.trim();
      if (!v || !email.validity.valid) { err(v ? "Check the email address: it should look like name@example.com." : "Enter your email address."); email.focus(); return; }
      err("");
      form.querySelector(".mk-news__addr").textContent = v;
      step.hidden = true; done.hidden = false; done.focus();
    });
    form.querySelector(".mk-news__again").addEventListener("click", function () {
      done.hidden = true; step.hidden = false; email.select(); email.focus();
    });
  }

  function render() {
    document.querySelectorAll("[data-part]").forEach(function (el) {
      var fn = parts[el.getAttribute("data-part")];
      if (fn) el.outerHTML = fn();
    });
    menu();
    newsletter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
