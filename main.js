// Nav: glass effect on scroll
const pill = document.getElementById('navPill');
window.addEventListener('scroll', () => {
  pill.classList.toggle('scrolled', window.scrollY > 12);
}, { passive: true });

// Mobile menu toggle
const burger    = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close mobile menu when any link inside it is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// Reveal elements on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '-50px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
