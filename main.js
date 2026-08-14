const sidebar = document.querySelector('.sidebar');
const toggle = document.querySelector('.menu-toggle');
const links = [...document.querySelectorAll('#site-nav a')];
const sections = [...document.querySelectorAll('main > section[id]')];

toggle.addEventListener('click', () => {
  const open = sidebar.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});

links.forEach(link => link.addEventListener('click', () => {
  sidebar.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

document.querySelector('.mobile-nav-cta')?.addEventListener('click', () => {
  sidebar.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
});

function updateActiveNav(sectionId) {
  const activeLink = links.find(link => link.hash === `#${sectionId}`) || links[0];
  links.forEach(link => {
    const isActive = link === activeLink;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  const nav = activeLink.closest('nav');
  nav.style.setProperty('--indicator-y', `${activeLink.offsetTop}px`);
  nav.style.setProperty('--indicator-height', `${activeLink.offsetHeight}px`);
}

const observer = new IntersectionObserver(entries => {
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  updateActiveNav(visible.target.id);
}, { rootMargin: '-20% 0px -55%', threshold: [0, .2, .5] });

sections.forEach(section => observer.observe(section));
updateActiveNav(location.hash.slice(1) || 'home');
window.addEventListener('load', () => updateActiveNav(document.querySelector('#site-nav a.active')?.hash.slice(1) || 'home'));
window.addEventListener('resize', () => updateActiveNav(document.querySelector('#site-nav a.active')?.hash.slice(1) || 'home'));

const contactModal = document.querySelector('#contactModal');
const contactForm = document.querySelector('[data-contact-form]');
const contactFormWrap = document.querySelector('#contactFormWrap');
const contactSuccess = document.querySelector('#contactSuccess');
const contactError = document.querySelector('#contactError');
let previouslyFocusedElement = null;

function openContactModal(trigger) {
  if (!contactModal) return;
  if (contactSuccess.classList.contains('contact-success--visible')) {
    contactSuccess.classList.remove('contact-success--visible');
    contactFormWrap.classList.remove('contact-form-wrap--hidden');
  }
  previouslyFocusedElement = trigger || document.activeElement;
  contactModal.classList.add('contact-modal--open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => contactModal.querySelector('input')?.focus());
}

function closeContactModal() {
  if (!contactModal) return;
  contactModal.classList.remove('contact-modal--open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
}

function keepFocusInsideModal(event) {
  if (event.key !== 'Tab' || !contactModal) return;
  const focusable = [...contactModal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')]
    .filter(element => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener('click', event => {
  const actionElement = event.target instanceof Element ? event.target.closest('[data-action]') : null;
  const action = actionElement?.dataset.action;
  if (action === 'open-contact') openContactModal(actionElement);
  if (action === 'close-contact' || event.target === contactModal) closeContactModal();
});

document.addEventListener('keydown', event => {
  if (!contactModal?.classList.contains('contact-modal--open')) return;
  if (event.key === 'Escape') closeContactModal();
  keepFocusInsideModal(event);
});

contactForm?.addEventListener('submit', async event => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  contactError.hidden = true;
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch(contactForm.action, {
      method: contactForm.method,
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);
    contactForm.reset();
    contactFormWrap.classList.add('contact-form-wrap--hidden');
    contactSuccess.classList.add('contact-success--visible');
    contactSuccess.querySelector('button')?.focus();
  } catch (error) {
    contactError.hidden = false;
    console.error('Unable to submit the contact form.', error);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealGroups = [
  ...document.querySelectorAll('.project, .more-work, .testimonials blockquote, .service-grid article, .contact-card')
];

revealGroups.forEach((element, index) => {
  element.classList.add('scroll-reveal');
  element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
});

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealGroups.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10%', threshold: 0.12 });

  revealGroups.forEach(element => revealObserver.observe(element));
}
