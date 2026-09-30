(function () {
  var root = document.documentElement;
  var body = document.body;
  var TITLES = {
    ms: 'Koleksi Resepi Dessert & Bakery Homemade | Arkib Digital',
    en: 'Dessert & Bakery Homemade Recipe Collection | Arkib Digital'
  };
  var TOPBAR = 76;

  function lang() { return root.getAttribute('data-lang') === 'en' ? 'en' : 'ms'; }

  /* ---------- language switch ---------- */
  var buttons = document.querySelectorAll('[data-set-lang]');

  function paintButtons() {
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-set-lang') === lang() ? 'true' : 'false');
    });
    document.title = TITLES[lang()];
  }

  // Find the section the reader is looking at, so we can land on the same one in the other language.
  function currentAnchor() {
    var pane = document.querySelector('.pane[data-lang-pane="' + lang() + '"]');
    if (!pane) return null;
    var items = pane.querySelectorAll('[data-key].recipe, [data-key].section, .chapter__head[data-key]');
    var best = null;
    for (var i = 0; i < items.length; i++) {
      var top = items[i].getBoundingClientRect().top;
      if (top - TOPBAR <= 8) best = { key: items[i].getAttribute('data-key'), offset: top };
      else break;
    }
    return best;
  }

  function jump(y) {
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, y);
    root.style.scrollBehavior = '';
  }

  function setLang(next, keepPlace) {
    if (next === lang()) return;
    var anchor = keepPlace ? currentAnchor() : null;
    root.setAttribute('data-lang', next);
    root.setAttribute('lang', next);
    try { localStorage.setItem('lang', next); } catch (e) {}
    var url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(null, '', url.pathname + url.search + location.hash.replace(/#(ms|en)-/, '#' + next + '-'));
    paintButtons();
    if (anchor) {
      var pane = document.querySelector('.pane[data-lang-pane="' + next + '"]');
      var target = pane.querySelector('.recipe[data-key="' + anchor.key + '"], .section[data-key="' + anchor.key + '"], .chapter__head[data-key="' + anchor.key + '"]');
      if (target) {
        var y = window.scrollY + target.getBoundingClientRect().top - anchor.offset;
        jump(y);
      }
    } else {
      jump(0);
    }
    observe();
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang'), window.scrollY > 200); });
  });

  // Links pointing at the other language (e.g. shared URL with #en-s12) switch automatically.
  function syncHash() {
    var m = location.hash.match(/^#(ms|en)-/);
    if (m && m[1] !== lang()) {
      root.setAttribute('data-lang', m[1]);
      root.setAttribute('lang', m[1]);
      paintButtons();
      var el = document.getElementById(location.hash.slice(1));
      if (el) el.scrollIntoView();
    }
  }
  window.addEventListener('hashchange', syncHash);

  /* ---------- drawer ---------- */
  var drawer = document.getElementById('drawer');
  var scrim = document.querySelector('.scrim');
  var menuBtn = document.querySelector('.topbar__menu');
  var closeBtn = document.querySelector('.drawer__close');
  var desktop = window.matchMedia('(min-width: 1080px)');

  function openDrawer() {
    body.classList.add('drawer-open');
    scrim.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    var current = drawer.querySelector('div[data-lang-pane="' + lang() + '"] a.is-current') ||
                  drawer.querySelector('div[data-lang-pane="' + lang() + '"] a');
    if (current) {
      current.scrollIntoView({ block: 'center' });
      current.focus({ preventScroll: true });
    }
  }
  function closeDrawer(returnFocus) {
    if (!body.classList.contains('drawer-open')) return;
    body.classList.remove('drawer-open');
    scrim.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', function () { closeDrawer(true); });
  scrim.addEventListener('click', function () { closeDrawer(true); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(true); });
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a') && !desktop.matches) closeDrawer(false);
  });

  /* ---------- scrollspy for the contents list ---------- */
  var io = null;
  function observe() {
    if (!('IntersectionObserver' in window)) return;
    if (io) io.disconnect();
    var pane = document.querySelector('.pane[data-lang-pane="' + lang() + '"]');
    var tocPane = drawer.querySelector('div[data-lang-pane="' + lang() + '"]');
    var links = {};
    tocPane.querySelectorAll('a[data-key]').forEach(function (a) { links[a.getAttribute('data-key')] = a; });
    var active = null;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var link = links[en.target.getAttribute('data-key')];
        if (!link || link === active) return;
        if (active) active.classList.remove('is-current');
        link.classList.add('is-current');
        active = link;
        if (desktop.matches) {
          var r = link.getBoundingClientRect();
          var dr = drawer.getBoundingClientRect();
          if (r.top < dr.top + 60 || r.bottom > dr.bottom - 20) link.scrollIntoView({ block: 'center' });
        }
      });
    }, { rootMargin: '-' + TOPBAR + 'px 0px -70% 0px' });
    pane.querySelectorAll('.recipe[data-key], .section[data-key], .chapter__head[data-key]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- back to top ---------- */
  var toTop = document.querySelector('.to-top');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      toTop.hidden = window.scrollY < 900;
      ticking = false;
    });
  }, { passive: true });

  paintButtons();
  syncHash();
  observe();
})();
