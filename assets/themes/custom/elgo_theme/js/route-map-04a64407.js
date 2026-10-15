/* Copied from the mockups (assets/route-map.js, review snapshot 2026-09-29), for the
   personal page hero (templates/mockup/route-hero.html.twig); only change: it stops
   when the page has no route map. */
/* Route map hero (variants A and E).
   Departure / destination cities typed into the headline, with the route drawn
   on the basemap as the destination is typed. Each finished route stays behind
   as a fading trail, so over a few cycles the map fills with routes across all
   of India and every EU member state.
   Expects the markup used in variant-a2-two-cities.html and variant-e2-your-route.html (ids a-map-svg, a-hubs,
   a-trails, a-city-layer, a-route-*, a-pin-*, a-label-*, a-from, a-to,
   a-lines, hero-title, a-pause, a-map-space).
   Public API for variant E: window.ElgoRoute.chooseFrom(city), .resume(), .cities
   Variant K: .showRoute(city, cc, countryName).
   External mode (variant K2): set window.ELGO_ROUTE_EXTERNAL = true before this script; the
   page then drives the map with .draw({ city, cc, name, ms }) and nothing here types or rotates.
   Optional: window.ELGO_ROUTE_EXTRA_LINES = [...] extra headline strings to fit.
   Projection must match img/basemap-eu-india.svg (see tools/build-basemap.py). */
(function () {
  if (!document.getElementById("a-map-svg")) return;
  var LON0 = -100, LATTOP = 80, K = 10;
  function my(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI; }
  function proj(c) { return [(c[1] - LON0) * K, (my(LATTOP) - my(c[0])) * K]; }

  /* Indian cities spread across every region: south, west, north, east, north-east */
  var IN = {
    "Bengaluru": [12.97, 77.59], "Hyderabad": [17.39, 78.49], "Pune": [18.52, 73.86], "Chennai": [13.08, 80.27],
    "Delhi NCR": [28.61, 77.21], "Mumbai": [19.08, 72.88], "Kolkata": [22.57, 88.36], "Ahmedabad": [23.02, 72.57],
    "Kochi": [9.93, 76.27], "Jaipur": [26.91, 75.79], "Indore": [22.72, 75.86], "Coimbatore": [11.02, 76.96],
    "Bhubaneswar": [20.30, 85.82], "Chandigarh": [30.73, 76.78], "Lucknow": [26.85, 80.95], "Nagpur": [21.15, 79.09],
    "Guwahati": [26.14, 91.74], "Mysuru": [12.30, 76.64], "Mangaluru": [12.91, 74.86]
  };
  /* At least one city in every EU member state (27) */
  var EU = {
    "Vienna": [48.21, 16.37, "AT"], "Brussels": [50.85, 4.35, "BE"], "Sofia": [42.70, 23.32, "BG"], "Zagreb": [45.81, 15.98, "HR"],
    "Nicosia": [35.19, 33.38, "CY"], "Prague": [50.08, 14.44, "CZ"], "Copenhagen": [55.68, 12.57, "DK"], "Tallinn": [59.44, 24.75, "EE"],
    "Helsinki": [60.17, 24.94, "FI"], "Paris": [48.86, 2.35, "FR"], "Lyon": [45.76, 4.84, "FR"], "Berlin": [52.52, 13.40, "DE"],
    "Munich": [48.14, 11.58, "DE"], "Athens": [37.98, 23.73, "GR"], "Budapest": [47.50, 19.04, "HU"], "Dublin": [53.35, -6.26, "IE"],
    "Milan": [45.46, 9.19, "IT"], "Riga": [56.95, 24.11, "LV"], "Vilnius": [54.69, 25.28, "LT"], "Luxembourg": [49.61, 6.13, "LU"],
    "Valletta": [35.90, 14.51, "MT"], "Amsterdam": [52.37, 4.90, "NL"], "Warsaw": [52.23, 21.01, "PL"], "Lisbon": [38.72, -9.14, "PT"],
    "Bucharest": [44.43, 26.10, "RO"], "Bratislava": [48.15, 17.11, "SK"], "Ljubljana": [46.06, 14.51, "SI"], "Madrid": [40.42, -3.70, "ES"],
    "Barcelona": [41.39, 2.17, "ES"], "Stockholm": [59.33, 18.07, "SE"]
  };

  /* Timing, in ms. One full swap is roughly 1.1 s of typing, then a 2.2 s hold. */
  var T = { erase: 26, type: 52, jitter: 0.45, gapWord: 140, hold: 2200, holdReduced: 5000, trails: 16 };
  var NS = "http://www.w3.org/2000/svg";
  var $ = function (id) { return document.getElementById(id); };
  // ?motion in the URL forces full animation (demos on machines with animations turned off)
  var reduce = !/[?&]motion\b/.test(location.search) &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var svg = $("a-map-svg"), hubs = $("a-hubs"), trails = $("a-trails");
  var fromEl = $("a-from"), toEl = $("a-to");

  /* Inline the basemap so its land colours follow the theme tokens (an <image>
     can't see page CSS). Keeps the <image> when fetch fails, e.g. on file://.
     Offline snapshots set window.ELGO_BASEMAP_SVG (the SVG as a string) instead,
     so the map is themed from file:// too (see tools/export-snapshot.py). */
  (function inlineBasemap() {
    var img = svg.querySelector("image[href*='basemap']");
    if (!img) return;
    var got = window.ELGO_BASEMAP_SVG ? Promise.resolve(window.ELGO_BASEMAP_SVG)
      : (!window.fetch || location.protocol === "file:") ? null
      : fetch(img.getAttribute("href")).then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); });
    if (!got) return;
    got.then(function (txt) {
      var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
      var cls = { "#15307e": "a-land", "#2448a8": "a-land a-land--eu", "#3a4c8f": "a-land a-land--in" };
      var g = document.createElementNS(NS, "g");
      g.setAttribute("stroke-linejoin", "round");
      doc.querySelectorAll("path").forEach(function (p) {
        var el = document.createElementNS(NS, "path");
        el.setAttribute("d", p.getAttribute("d"));
        el.setAttribute("class", cls[(p.getAttribute("fill") || "").toLowerCase()] || "a-land");
        el.setAttribute("stroke-width", p.getAttribute("stroke-width") || "0.8");
        g.appendChild(el);
      });
      img.parentNode.replaceChild(g, img);
    }).catch(function () {});
  })();

  /* ---- Sequence: every EU city once per round, Indian cities shuffled ---- */
  function shuffled(keys) {
    var a = keys.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var bagIN = [], bagEU = [];
  function nextPair(prev) {
    if (!bagIN.length) bagIN = shuffled(Object.keys(IN));
    if (!bagEU.length) bagEU = shuffled(Object.keys(EU));
    var f = bagIN.pop(), t = bagEU.pop();
    if (prev && f === prev[0] && bagIN.length) f = bagIN.pop();   // no city twice in a row
    if (prev && t === prev[1] && bagEU.length) t = bagEU.pop();
    return [f, t];
  }

  /* ---- Map framing: Ireland-to-eastern-India fitted into a frame ----
     By default the frame is the band above the text panel (#a-map-space, full
     width). A page can instead mark any element #a-map-frame (e.g. the right
     half of a two-column hero); the map is fitted and centred inside it. */
  var FOCUS_NW = [62, -12], FOCUS_SE = [4, 92], S = 1, VIS = [-Infinity, -Infinity, Infinity, Infinity];
  var frameEl = $("a-map-frame");
  function fitMap() {
    var a = proj(FOCUS_NW), b = proj(FOCUS_SE), vw = b[0] - a[0], vh = b[1] - a[1];
    var W = svg.clientWidth || 1, H = svg.clientHeight || 1;
    var fx = 0, fy = 0, fw = W, fh = ($("a-map-space") && $("a-map-space").offsetHeight) || H;
    if (frameEl) {
      var sr = svg.getBoundingClientRect(), fr = frameEl.getBoundingClientRect();
      fx = fr.left - sr.left; fy = fr.top - sr.top; fw = fr.width || W; fh = fr.height || H;
    }
    var pxPerUnit = Math.min(fw / vw, fh / vh);
    var vbW = W / pxPerUnit, vbH = H / pxPerUnit;
    var vbX = a[0] + vw / 2 - (fx + fw / 2) / pxPerUnit, vbY = a[1] + vh / 2 - (fy + fh / 2) / pxPerUnit;
    svg.setAttribute("viewBox", vbX + " " + vbY + " " + vbW + " " + vbH);
    S = Math.max(1, 0.62 / pxPerUnit);        // scale marks up when the map is drawn small (phones)
    VIS = [vbX + fx / pxPerUnit, vbY + fy / pxPerUnit, vbX + (fx + fw) / pxPerUnit, vbY + (fy + fh) / pxPerUnit]; // where city labels may go
    $("a-route-line").style.strokeWidth = 4.5 * S;
    $("a-route-base").style.strokeWidth = 3 * S;
    ["a-pin-from", "a-pin-to"].forEach(function (id) { $(id).setAttribute("r", 9 * S); $(id).style.strokeWidth = 4 * S; });
    $("a-pulse").setAttribute("r", 12 * S);
    $("a-traveller").setAttribute("r", 6 * S);
    hubs.querySelectorAll("circle").forEach(function (c) { c.setAttribute("r", 4.5 * S); });
    trails.querySelectorAll("path").forEach(function (p) { p.style.strokeWidth = 2 * S; });
  }

  function hub(c, cls) {
    var p = proj(c), el = document.createElementNS(NS, "circle");
    el.setAttribute("cx", p[0]); el.setAttribute("cy", p[1]); el.setAttribute("r", 4.5); el.setAttribute("class", cls);
    hubs.appendChild(el);
  }
  Object.keys(IN).forEach(function (k) { hub(IN[k], "a-hub a-hub--in"); });
  Object.keys(EU).forEach(function (k) { hub(EU[k], "a-hub"); });

  function label(g, name, cc, x, y, side) {
    g.innerHTML = "";
    var t = document.createElementNS(NS, "text");
    t.setAttribute("font-size", 26 * S);
    t.textContent = name.toUpperCase() + " ";
    var s = document.createElementNS(NS, "tspan");
    s.setAttribute("class", "a-label__cc"); s.setAttribute("font-size", 20 * S);
    s.textContent = cc;
    t.appendChild(s);
    g.appendChild(t);
    var b = t.getBBox(), padX = 14 * S, padY = 9 * S, w = b.width + padX * 2, h = b.height + padY * 2;
    var gap = 20 * S, m = 8 * S;
    var lx = side === "in" ? x + gap : x - w - gap;
    if (lx + w > VIS[2] - m) lx = x - w - gap;      // no room on the right: flip left
    if (lx < VIS[0] + m) lx = x + gap;              // no room on the left: flip right
    lx = Math.max(VIS[0] + m, Math.min(lx, VIS[2] - m - w));
    var ly = side === "in" ? y - h / 2 : y - h - 16 * S;
    ly = Math.max(VIS[1] + m, Math.min(ly, VIS[3] - m - h));
    var r = document.createElementNS(NS, "rect");
    r.setAttribute("x", lx); r.setAttribute("y", ly); r.setAttribute("width", w); r.setAttribute("height", h);
    g.insertBefore(r, t);
    t.setAttribute("x", lx + padX); t.setAttribute("y", ly + padY - b.y);
  }
  function show(ids, on) { ids.forEach(function (id) { $(id).classList.toggle("is-hidden", !on); }); }
  function place(which, name) {
    var p = which === "from" ? proj(IN[name]) : proj(EU[name]);
    var pins = which === "from" ? ["a-pin-from"] : ["a-pin-to", "a-pulse"];
    pins.forEach(function (id) { $(id).setAttribute("cx", p[0]); $(id).setAttribute("cy", p[1]); });
    label($("a-label-" + which), name, which === "from" ? "IN" : EU[name][2], p[0], p[1], which === "from" ? "in" : "eu");
  }
  function routeD(from, to) {
    var p = proj(IN[from]), q = proj(EU[to]);
    var dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy);
    var nx = -dy / d, ny = dx / d;
    if (ny > 0) { nx = -nx; ny = -ny; }             // bow the route northwards
    var cx = (p[0] + q[0]) / 2 + nx * d * 0.3, cy = (p[1] + q[1]) / 2 + ny * d * 0.3;
    return "M" + p[0] + " " + p[1] + " Q" + cx + " " + cy + " " + q[0] + " " + q[1];
  }

  /* Finished routes stay as trails; older ones fade, newest are brightest */
  function addTrail(d) {
    var el = document.createElementNS(NS, "path");
    el.setAttribute("d", d); el.setAttribute("class", "a-trail");
    el.style.strokeWidth = 2 * S; el.style.opacity = 0;
    trails.appendChild(el);
    while (trails.childNodes.length > T.trails) trails.removeChild(trails.firstChild);
    var list = trails.childNodes, n = list.length;
    requestAnimationFrame(function () {
      for (var i = 0; i < n; i++) list[i].style.opacity = (0.08 + 0.42 * (i + 1) / n).toFixed(2);
    });
  }

  /* ---- Route drawing ---- */
  var raf;
  function drawRoute(ms) {
    var line = $("a-route-line"), trav = $("a-traveller");
    var len = line.getTotalLength();
    line.style.strokeDasharray = len;
    cancelAnimationFrame(raf);
    if (reduce || !ms) { line.style.strokeDashoffset = 0; trav.style.display = "none"; return; }
    line.style.strokeDashoffset = len;
    trav.style.display = "";
    var t0 = performance.now();
    (function step(now) {
      var t = Math.min(1, (now - t0) / ms);
      var e = 1 - Math.pow(1 - t, 3);
      line.style.strokeDashoffset = len * (1 - e);
      var pt = line.getPointAtLength(len * e);
      trav.setAttribute("cx", pt.x); trav.setAttribute("cy", pt.y);
      if (t < 1) raf = requestAnimationFrame(step); else trav.style.display = "none";
    })(t0);
  }

  /* ---- Typing ---- */
  var caret = document.createElement("span");
  caret.className = "a-caret";
  function caretAfter(el) { el.after(caret); }
  var token = 0;
  function Cancel() {}
  function sleep(ms, tk) {
    return new Promise(function (res, rej) { setTimeout(function () { tk === token ? res() : rej(new Cancel()); }, ms); });
  }
  function jit(ms) { return ms * (1 - T.jitter / 2 + Math.random() * T.jitter); }
  async function retype(el, text, tk) {
    caretAfter(el); caret.classList.add("is-typing");
    while (el.textContent.length) { el.textContent = el.textContent.slice(0, -1); await sleep(jit(T.erase), tk); }
    await sleep(80, tk);
    for (var i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await sleep(jit(T.type), tk); }
    caret.classList.remove("is-typing");
  }
  function typeTime(oldText, newText) { return oldText.length * T.erase + 80 + newText.length * T.type; }

  /* ---- One cycle ---- */
  var cur = ["Bengaluru", "Berlin"];
  function settle(pair) {             // jump straight to the finished state of a pair
    cancelAnimationFrame(raf);
    fromEl.textContent = pair[0]; toEl.textContent = pair[1];
    caretAfter(toEl); caret.classList.remove("is-typing");
    place("from", pair[0]); place("to", pair[1]);
    var d = routeD(pair[0], pair[1]);
    $("a-route-base").setAttribute("d", d); $("a-route-line").setAttribute("d", d);
    drawRoute(0);
    show(["a-pin-from", "a-label-from", "a-pin-to", "a-label-to", "a-pulse", "a-route-line", "a-route-base"], true);
    cur = pair;
  }
  async function cycle(pair, tk) {
    addTrail(routeD(cur[0], cur[1]));
    show(["a-route-line", "a-route-base", "a-pin-to", "a-label-to", "a-pulse", "a-pin-from", "a-label-from"], false);
    await retype(fromEl, pair[0], tk);
    place("from", pair[0]); show(["a-pin-from", "a-label-from"], true);
    await sleep(T.gapWord, tk);
    var d = routeD(pair[0], pair[1]);
    $("a-route-base").setAttribute("d", d); $("a-route-line").setAttribute("d", d);
    show(["a-route-line", "a-route-base"], true);
    drawRoute(typeTime(toEl.textContent, pair[1]));   // route lands as the name finishes
    await retype(toEl, pair[1], tk);
    place("to", pair[1]); show(["a-pin-to", "a-label-to", "a-pulse"], true);
    cur = pair;
  }

  var paused = false, pending = null;
  async function run() {
    var tk = ++token;
    try {
      while (true) {
        await sleep(reduce ? T.holdReduced : T.hold, tk);
        pending = nextPair(cur);
        if (reduce) { addTrail(routeD(cur[0], cur[1])); settle(pending); }
        else await cycle(pending, tk);
        pending = null;
      }
    } catch (e) {
      if (!(e instanceof Cancel)) throw e;
      // paused mid-typing: finish that pair instantly (unless a visitor's own route has taken over)
      if (pending && !fanCity) settle(pending);
      pending = null;
    }
  }

  /* ---- Headline sizing: one size that fits the longest name, so it never reflows ---- */
  var title = $("hero-title"), lines = $("a-lines");
  var EXTRA = (window.ELGO_ROUTE_EXTRA_LINES || []);
  function fitHeadline() {
    title.style.fontSize = "";
    var cs = getComputedStyle(lines), base = parseFloat(cs.fontSize);
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.font = cs.fontWeight + " " + base + "px " + cs.fontFamily;
    var widest = 0;
    Object.keys(IN).forEach(function (n) { widest = Math.max(widest, ctx.measureText("From " + n).width); });
    Object.keys(EU).forEach(function (n) { widest = Math.max(widest, ctx.measureText("to " + n + ".").width); });
    EXTRA.forEach(function (s) { widest = Math.max(widest, ctx.measureText(s).width); });
    widest += base * 0.15;                                   // caret and rounding
    var avail = title.clientWidth;
    if (widest > avail) title.style.fontSize = (base * avail / widest).toFixed(1) + "px";
  }

  /* ---- Pause / play ---- */
  var btn = $("a-pause") || (function () { var b = document.createElement("button"); b.innerHTML = "<svg></svg><span></span>"; return b; })();
  function syncBtn() {
    btn.setAttribute("aria-pressed", String(paused));
    btn.querySelector("span").textContent = paused ? "Play" : "Pause";
    btn.querySelector("svg").innerHTML = paused
      ? '<path d="M2 1l9 5-9 5z" fill="currentColor"/>'
      : '<rect x="2" y="1" width="3" height="10" fill="currentColor"/><rect x="7" y="1" width="3" height="10" fill="currentColor"/>';
    btn.setAttribute("aria-label", paused ? "Play city changes" : "Pause city changes");
  }
  btn.addEventListener("click", function () {
    paused = !paused;
    if (paused) token++; else { clearFan(); run(); }
    syncBtn();
  });

  /* ---- "Your route" mode (variant E): the visitor's city fans out to all of Europe ---- */
  var FAN_TO = ["Dublin", "Lisbon", "Madrid", "Paris", "Amsterdam", "Berlin", "Copenhagen", "Stockholm", "Warsaw", "Vienna", "Budapest", "Athens"];
  var fanCity = null, fanGroup = document.createElementNS(NS, "g");
  fanGroup.setAttribute("class", "a-fan");
  svg.insertBefore(fanGroup, $("a-city-layer"));
  function drawFan(city, animate) {
    fanGroup.innerHTML = "";
    FAN_TO.forEach(function (to, i) {
      var el = document.createElementNS(NS, "path");
      el.setAttribute("d", routeD(city, to));
      el.setAttribute("class", "a-fan__route");
      el.style.strokeWidth = 3 * S;
      fanGroup.appendChild(el);
      var q = proj(EU[to]), dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", q[0]); dot.setAttribute("cy", q[1]); dot.setAttribute("r", 7 * S);
      dot.setAttribute("class", "a-fan__dot");
      fanGroup.appendChild(dot);
      if (animate && !reduce) {
        var len = el.getTotalLength();
        el.style.strokeDasharray = len; el.style.strokeDashoffset = len;
        dot.style.opacity = 0;
        setTimeout(function () {
          el.style.transition = "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)"; el.style.strokeDashoffset = 0;
          dot.style.transition = "opacity .3s .8s"; dot.style.opacity = 1;
        }, 60 * i);
      }
    });
  }
  function clearFan() {
    fanCity = null; fanGroup.innerHTML = "";
    trails.style.opacity = "";
  }
  async function chooseFrom(city) {
    if (!IN[city]) return;
    token++; paused = true; syncBtn();          // stop the rotation; Play resumes it
    cancelAnimationFrame(raf);
    fanCity = city;
    trails.style.opacity = "0";
    show(["a-route-line", "a-route-base", "a-pin-to", "a-label-to", "a-pulse", "a-traveller"], false);
    var tk = ++token;
    try {
      if (reduce) { fromEl.textContent = city; toEl.textContent = "Europe"; caretAfter(toEl); }
      else { await retype(fromEl, city, tk); }
      place("from", city); show(["a-pin-from", "a-label-from"], true);
      drawFan(city, true);
      if (!reduce) await retype(toEl, "Europe", tk);
    } catch (e) { if (!(e instanceof Cancel)) throw e; }
  }
  /* ---- Chosen route (variant K): the visitor's own from / to, typed and drawn ----
     showRoute(city, cc, countryName): city = an Indian city or "" (anywhere in India),
     cc = an EU country code or "" (anywhere in Europe). Nothing leaves the page. */
  var FAN_FROM = ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Delhi NCR", "Mumbai", "Kolkata", "Kochi", "Guwahati", "Ahmedabad", "Jaipur", "Bhubaneswar"];
  var chosen = null;
  function cityIn(cc) { for (var k in EU) if (EU[k][2] === cc) return k; return null; }
  function drawFanTo(to, animate) {
    fanGroup.innerHTML = "";
    FAN_FROM.forEach(function (from, i) {
      var el = document.createElementNS(NS, "path");
      el.setAttribute("d", routeD(from, to));
      el.setAttribute("class", "a-fan__route");
      el.style.strokeWidth = 3 * S;
      fanGroup.appendChild(el);
      var p = proj(IN[from]), dot = document.createElementNS(NS, "circle");
      dot.setAttribute("cx", p[0]); dot.setAttribute("cy", p[1]); dot.setAttribute("r", 6 * S);
      dot.setAttribute("class", "a-fan__dot");
      fanGroup.appendChild(dot);
      if (animate && !reduce) {
        var len = el.getTotalLength();
        el.style.strokeDasharray = len; el.style.strokeDashoffset = len; dot.style.opacity = 0;
        setTimeout(function () {
          el.style.transition = "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)"; el.style.strokeDashoffset = 0;
          dot.style.transition = "opacity .3s"; dot.style.opacity = 1;
        }, 60 * i);
      }
    });
  }
  function placeTo(to, name, cc) {
    var p = proj(EU[to]);
    ["a-pin-to", "a-pulse"].forEach(function (id) { $(id).setAttribute("cx", p[0]); $(id).setAttribute("cy", p[1]); });
    label($("a-label-to"), name, cc, p[0], p[1], "eu");
  }
  function drawChosen(animate) {                  // map only; the headline is typed by showRoute
    var c = chosen, to = c.cc ? cityIn(c.cc) : null;
    fanGroup.innerHTML = "";
    show(["a-route-line", "a-route-base", "a-pin-to", "a-label-to", "a-pulse", "a-traveller", "a-pin-from", "a-label-from"], false);
    if (c.city) { place("from", c.city); show(["a-pin-from", "a-label-from"], true); }
    if (c.city && to) {
      var d = routeD(c.city, to);
      $("a-route-base").setAttribute("d", d); $("a-route-line").setAttribute("d", d);
      show(["a-route-line", "a-route-base"], true);
      drawRoute(animate ? 900 : 0);
    } else if (c.city) drawFan(c.city, animate);
    else if (to) drawFanTo(to, animate);
    if (to) { placeTo(to, c.name, c.cc); show(["a-pin-to", "a-label-to", "a-pulse"], true); }
  }
  async function showRoute(city, cc, name) {
    city = IN[city] ? city : ""; cc = cc && cityIn(cc) ? cc : "";
    if (!city && !cc) { chosen = null; if (paused) btn.click(); return; }   // back to the rotation
    token++; paused = true; syncBtn();
    cancelAnimationFrame(raf);
    fanCity = city || "India";                     // stops the rotation settling its last pair
    chosen = { city: city, cc: cc, name: name || cc };
    trails.style.opacity = "0";
    var tk = ++token, toText = cc ? chosen.name : "Europe", fromText = city || "India";
    try {
      if (reduce) { fromEl.textContent = fromText; toEl.textContent = toText; caretAfter(toEl); drawChosen(false); return; }
      await retype(fromEl, fromText, tk);
      drawChosen(true);
      await retype(toEl, toText, tk);
    } catch (e) { if (!(e instanceof Cancel)) throw e; }
  }
  btn.addEventListener("click", function () { if (!paused) chosen = null; });   // Play clears a chosen route

  window.ElgoRoute = { cities: Object.keys(IN).sort(), chooseFrom: chooseFrom, showRoute: showRoute,
    resume: function () { if (paused) btn.click(); } };

  /* ---- External mode (variant K2): the page types its own sentence and asks for routes ---- */
  if (window.ELGO_ROUTE_EXTERNAL) {
    var lastD = null, current = null;
    function drawWeb(animate) {                        // anywhere in India to anywhere in the EU
      fanGroup.innerHTML = "";
      var TO = ["Dublin", "Lisbon", "Paris", "Amsterdam", "Berlin", "Stockholm", "Warsaw", "Vienna", "Milan", "Athens", "Helsinki", "Bucharest"];
      FAN_FROM.forEach(function (from, i) {
        var el = document.createElementNS(NS, "path");
        el.setAttribute("d", routeD(from, TO[i % TO.length]));
        el.setAttribute("class", "a-fan__route");
        el.style.strokeWidth = 2.4 * S; el.style.opacity = .7;
        fanGroup.appendChild(el);
        if (animate && !reduce) {
          var len = el.getTotalLength();
          el.style.strokeDasharray = len; el.style.strokeDashoffset = len;
          setTimeout(function () { el.style.transition = "stroke-dashoffset .9s cubic-bezier(.2,.7,.2,1)"; el.style.strokeDashoffset = 0; }, 50 * i);
        }
      });
    }
    function draw(o, keepTrail) {
      o = o || {}; current = o;
      var city = IN[o.city] ? o.city : "", to = o.cc ? cityIn(o.cc) : null, ms = o.ms || 0;
      if (keepTrail !== false && lastD) addTrail(lastD);
      lastD = null;
      fanGroup.innerHTML = "";
      cancelAnimationFrame(raf);
      show(["a-route-line", "a-route-base", "a-pin-to", "a-label-to", "a-pulse", "a-traveller", "a-pin-from", "a-label-from"], false);
      if (city) { place("from", city); show(["a-pin-from", "a-label-from"], true); }
      if (city && to) {
        var d = routeD(city, to);
        $("a-route-base").setAttribute("d", d); $("a-route-line").setAttribute("d", d);
        show(["a-route-line", "a-route-base"], true);
        drawRoute(ms);
        lastD = d;
      } else if (city) drawFan(city, ms > 0);
      else if (to) drawFanTo(to, ms > 0);
      else drawWeb(ms > 0);
      if (to) { placeTo(to, o.name || o.cc, o.cc); show(["a-pin-to", "a-label-to", "a-pulse"], true); }
    }
    window.ElgoRoute = { cities: Object.keys(IN).sort(), draw: draw };
    fitMap();
    var extResize;
    window.addEventListener("resize", function () {
      clearTimeout(extResize);
      extResize = setTimeout(function () { fitMap(); if (current) draw(Object.assign({}, current, { ms: 0 }), false); }, 150);
    });
    return;
  }

  fitMap();
  settle(cur);
  syncBtn();
  fitHeadline();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeadline);
  // themes load their own fonts; refit whenever a new face arrives (theme switch)
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", fitHeadline);
  var themeLink = document.getElementById("elgo-theme");
  if (themeLink) themeLink.addEventListener("load", fitHeadline);
  run();

  var resizeT;
  window.addEventListener("resize", function () {
    clearTimeout(resizeT);
    resizeT = setTimeout(function () {
      fitMap(); fitHeadline();
      if (chosen) drawChosen(false);
      else if (fanCity) { place("from", fanCity); drawFan(fanCity, false); }
      else { place("from", cur[0]); place("to", cur[1]); }
    }, 150);
  });
})();
