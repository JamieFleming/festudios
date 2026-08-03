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

  function initWorkCarousel() {
    document.querySelectorAll('[data-work-carousel]').forEach(function (carousel) {
      var track = carousel.querySelector('[data-work-track]');
      var previous = carousel.querySelector('[data-work-previous]');
      var next = carousel.querySelector('[data-work-next]');
      var firstCard = track && track.querySelector('.work-card');
      if (!track || !previous || !next || !firstCard) return;

      function updateControls() {
        var maxScroll = track.scrollWidth - track.clientWidth;
        previous.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= maxScroll - 2;
      }

      function scrollByCard(direction) {
        var gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
        var amount = firstCard.getBoundingClientRect().width + gap;
        track.scrollBy({ left: amount * direction, behavior: 'smooth' });
      }

      previous.addEventListener('click', function () { scrollByCard(-1); });
      next.addEventListener('click', function () { scrollByCard(1); });
      track.addEventListener('scroll', updateControls, { passive: true });
      window.addEventListener('resize', updateControls);
      updateControls();
    });
  }

  function openContact() {
    var m = document.getElementById('contactModal');
    if (!m) return;
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      m.style.opacity = '1';
      var c = m.querySelector('[data-modal-card]');
      if (c) c.style.transform = 'none';
    });
  }

  function closeContact() {
    var m = document.getElementById('contactModal');
    if (!m) return;
    m.style.opacity = '0';
    var c = m.querySelector('[data-modal-card]');
    if (c) c.style.transform = 'translateY(18px) scale(0.98)';
    document.body.style.overflow = '';
    setTimeout(function () { m.style.display = 'none'; }, 300);
  }

  async function submitContact(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var f = document.getElementById('contactFormWrap');
    var s = document.getElementById('contactSuccess');
    var error = document.getElementById('contactError');
    var submit = form.querySelector('[type="submit"]');
    var originalLabel = submit ? submit.textContent : '';
    if (error) error.hidden = true;
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Sending…';
    }

    try {
      var response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Form submission failed');
      form.reset();
      if (f) f.style.display = 'none';
      if (s) s.style.display = 'grid';
    } catch (err) {
      if (error) error.hidden = false;
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = originalLabel;
      }
    }
  }

  function initContactControls() {
    document.querySelectorAll('[data-action="open-contact"]').forEach(function (button) {
      button.addEventListener('click', openContact);
    });
    document.querySelectorAll('[data-action="close-contact"]').forEach(function (button) {
      button.addEventListener('click', closeContact);
    });
    document.querySelectorAll('[data-contact-form]').forEach(function (form) {
      form.addEventListener('submit', submitContact);
    });
  }

  document.addEventListener('click', function (e) {
    var m = document.getElementById('contactModal');
    if (m && e.target === m) closeContact();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeContact();
  });

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initTiles();
    initWorkCarousel();
    initContactControls();
  });
})();
