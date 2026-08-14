'use strict';

const SELECTORS = {
  modal: '#contactModal',
  navLinks: '#site-nav a',
  sections: 'main > section[id]',
  revealItems: '.project, .more-work, .testimonials blockquote, .service-grid article, .contact-card, [data-reveal]'
};

function initNavigation() {
  const sidebar = document.querySelector('.sidebar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = [...document.querySelectorAll(SELECTORS.navLinks)];
  const sections = document.querySelectorAll(SELECTORS.sections);

  if (!sidebar || !menuToggle || !navLinks.length) return;

  const closeMenu = () => {
    sidebar.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  };

  const setActiveLink = sectionId => {
    const activeLink = navLinks.find(link => {
      const mappedSections = link.dataset.sections?.split(' ') ?? [];
      return link.hash === `#${sectionId}` || mappedSections.includes(sectionId);
    }) ?? navLinks[0];
    const nav = activeLink.closest('nav');

    navLinks.forEach(link => {
      const isActive = link === activeLink;
      link.classList.toggle('active', isActive);
      isActive
        ? link.setAttribute('aria-current', 'page')
        : link.removeAttribute('aria-current');
    });

    nav?.style.setProperty('--indicator-y', `${activeLink.offsetTop}px`);
    nav?.style.setProperty('--indicator-height', `${activeLink.offsetHeight}px`);
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.querySelector('.mobile-nav-cta')?.addEventListener('click', closeMenu);

  document.addEventListener('click', event => {
    if (sidebar.classList.contains('open') && !sidebar.contains(event.target)) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !sidebar.classList.contains('open')) return;
    closeMenu();
    menuToggle.focus();
  });

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visibleSection = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSection) setActiveLink(visibleSection.target.id);
    }, {
      rootMargin: '-20% 0px -55%',
      threshold: [0, 0.2, 0.5]
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  const refreshIndicator = () => {
    const currentSection = document.querySelector(`${SELECTORS.navLinks}.active`)?.hash.slice(1);
    setActiveLink(currentSection || sections[0]?.id || 'home');
  };

  setActiveLink(location.hash.slice(1) || sections[0]?.id || 'home');
  window.addEventListener('load', refreshIndicator);
  window.addEventListener('resize', refreshIndicator);
}

function initContactModal() {
  const modal = document.querySelector(SELECTORS.modal);
  const form = document.querySelector('[data-contact-form]');
  const formWrap = document.querySelector('#contactFormWrap');
  const successMessage = document.querySelector('#contactSuccess');
  const errorMessage = document.querySelector('#contactError');

  if (!modal) return;

  let previouslyFocused = null;

  const resetModal = () => {
    successMessage?.classList.remove('contact-success--visible');
    formWrap?.classList.remove('contact-form-wrap--hidden');
  };

  const openModal = trigger => {
    resetModal();
    previouslyFocused = trigger ?? document.activeElement;
    modal.classList.add('contact-modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    document.querySelectorAll('body > header, body > main, body > footer').forEach(element => {
      element.inert = true;
    });
    requestAnimationFrame(() => modal.querySelector('input:not([type="hidden"]):not([tabindex="-1"])')?.focus());
  };

  const closeModal = () => {
    modal.classList.remove('contact-modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    document.querySelectorAll('body > header, body > main, body > footer').forEach(element => {
      element.inert = false;
    });
    if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
  };

  const trapFocus = event => {
    if (event.key !== 'Tab') return;

    const focusable = [...modal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
    )].filter(element => element.offsetParent !== null);

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
  };

  document.addEventListener('click', event => {
    const actionElement = event.target instanceof Element
      ? event.target.closest('[data-action]')
      : null;
    const action = actionElement?.dataset.action;

    if (action === 'open-contact') openModal(actionElement);
    if (action === 'close-contact' || event.target === modal) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (!modal.classList.contains('contact-modal--open')) return;
    if (event.key === 'Escape') closeModal();
    trapFocus(event);
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();

    const submitButton = form.querySelector('[type="submit"]');
    if (!(submitButton instanceof HTMLButtonElement)) return;

    const originalLabel = submitButton.innerHTML;
    if (errorMessage) errorMessage.hidden = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);

      form.reset();
      formWrap?.classList.add('contact-form-wrap--hidden');
      successMessage?.classList.add('contact-success--visible');
      successMessage?.querySelector('button')?.focus();
    } catch (error) {
      if (errorMessage) errorMessage.hidden = false;
      console.error('Unable to submit the contact form.', error);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalLabel;
    }
  });
}

function initScrollReveal() {
  const items = [...document.querySelectorAll(SELECTORS.revealItems)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  items.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -10%',
    threshold: 0.12
  });

  items.forEach(item => revealObserver.observe(item));
}

initNavigation();
initContactModal();
initScrollReveal();
