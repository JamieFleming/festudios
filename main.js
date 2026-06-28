// FE Studios — site behaviour (vanilla JS)
(function () {
  function initHeader() {
    var p = document.getElementById('siteHeader');
    if (!p) return;
    function onScroll() {
      if (window.scrollY > 12) {
        p.style.background = 'rgba(242,240,234,0.9)';
        p.style.borderBottomColor = 'rgba(26,24,20,0.1)';
      } else {
        p.style.background = 'rgba(242,240,234,0.72)';
        p.style.borderBottomColor = 'transparent';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initCarousel() {
    var track = document.getElementById('workTrack');
    if (!track) return;
    var down = false, sx = 0, sl = 0, moved = 0;
    track.addEventListener('pointerdown', function (e) { down = true; sx = e.clientX; sl = track.scrollLeft; moved = 0; track.style.cursor = 'grabbing'; });
    track.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); track.scrollLeft = sl - dx; });
    function up() { down = false; track.style.cursor = 'grab'; }
    track.addEventListener('pointerup', up);
    track.addEventListener('pointerleave', up);
    track.addEventListener('click', function (e) { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  }

  window.scrollWork = function (dir) {
    var t = document.getElementById('workTrack');
    if (!t) return;
    var slide = t.querySelector('[data-slide]');
    var gap = parseFloat(getComputedStyle(t).columnGap) || 24;
    var step = slide ? slide.getBoundingClientRect().width + gap : t.clientWidth * 0.8;
    t.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

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

  // close modal on backdrop click or Escape
  document.addEventListener('click', function (e) {
    var m = document.getElementById('contactModal');
    if (m && e.target === m) window.closeContact();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var menu = document.getElementById('mobileMenu');
    if (menu && menu.getAttribute('data-open') === '1') { window.toggleMenu(); return; }
    window.closeContact();
  });

  window.toggleMenu = function () {
    var m = document.getElementById('mobileMenu');
    if (!m) return;
    var open = m.getAttribute('data-open') === '1';
    if (open) {
      m.style.opacity = '0';
      m.style.transform = 'translateY(-8px)';
      m.setAttribute('data-open', '0');
      document.body.style.overflow = '';
      setTimeout(function () { m.style.display = 'none'; }, 280);
    } else {
      m.style.display = 'flex';
      m.setAttribute('data-open', '1');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          m.style.opacity = '1';
          m.style.transform = 'none';
        });
      });
    }
  };

  window.openContactFromMenu = function () {
    var m = document.getElementById('mobileMenu');
    if (m) { m.style.display = 'none'; m.setAttribute('data-open', '0'); }
    openContact();
  };

  document.addEventListener('DOMContentLoaded', function () { initHeader(); initCarousel(); });
})();
