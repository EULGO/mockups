// Tabs of a country profile: one panel at a time, the address keeps the tab
// (#work…), the FAQ answers open and close.
(function () {
  var tabs = [].slice.call(document.querySelectorAll('.cp-tab'));
  if (!tabs.length) return;
  function show(id, focus) {
    var found = tabs.some(function (t) { return t.getAttribute('aria-controls') === id; });
    if (!found) id = tabs[0].getAttribute('aria-controls');
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }
  window.addEventListener('hashchange', function () { show(location.hash.slice(1)); window.scrollTo({ top: document.querySelector('.cp-tabs-bar').offsetTop - 4 }); });
  document.addEventListener('keydown', function (e) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0 || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    location.hash = next.getAttribute('aria-controls');
    next.focus();
  });
  show(location.hash.slice(1));
  [].forEach.call(document.querySelectorAll('.cp-faq__toggle'), function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      document.getElementById(b.getAttribute('aria-controls')).hidden = open;
    });
  });
})();
