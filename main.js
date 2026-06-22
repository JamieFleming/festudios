// ── Scroll: nav glass effect
const pill = document.getElementById('navPill');
function onScroll() { pill.classList.toggle('scrolled', window.scrollY > 12); }
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ── Mobile menu
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

function closeNav() {
  mobileNav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}

// ── Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-50px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
