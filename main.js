// FE Studios — Playful — site behaviour (vanilla JS)
(function () {
  function initHeader() {
    var p = document.getElementById('siteHeader');
    if (!p) return;
    function onScroll() {
      if (window.scrollY > 12) {
        p.style.background = 'rgba(246,244,238,0.92)';
        p.style.borderBottomColor = 'rgba(26,24,20,0.1)';
      } else {
        p.style.background = 'rgba(246,244,238,0.7)';
        p.style.borderBottomColor = 'transparent';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initTiles() {
    document.querySelectorAll('[data-tile]').forEach(function (t) {
      var card = t.querySelector('[data-card]');
      if (!card) return;
      t.addEventListener('mouseenter', function () { card.style.transform = 'translateY(-6px)'; });
      t.addEventListener('mouseleave', function () { card.style.transform = 'none'; });
    });
  }

  window.openContact = function () {
    var m = document.getElementById('contactModal');
    if (!m) return;
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      m.style.opacity = '1';
      var c = m.querySelector('[data-modal-card]');
      if (c) c.style.transform = 'none';
    });
  };

  window.closeContact = function () {
    var m = document.getElementById('contactModal');
    if (!m) return;
    m.style.opacity = '0';
    var c = m.querySelector('[data-modal-card]');
    if (c) c.style.transform = 'translateY(18px) scale(0.98)';
    document.body.style.overflow = '';
    setTimeout(function () { m.style.display = 'none'; }, 300);
  };

  window.submitContact = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    var f = document.getElementById('contactFormWrap');
    var s = document.getElementById('contactSuccess');
    if (f) f.style.display = 'none';
    if (s) s.style.display = 'grid';
    return false;
  };

  document.addEventListener('click', function (e) {
    var m = document.getElementById('contactModal');
    if (m && e.target === m) window.closeContact();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeContact();
  });

  document.addEventListener('DOMContentLoaded', function () { initHeader(); initTiles(); });
})();
