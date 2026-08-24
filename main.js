"use strict";

/* --------------------------------------------------------------------------
 * Configuration
 * -------------------------------------------------------------------------- */

const SELECTORS = {
	modal: "#contactModal",
	navLinks: "#site-nav a",
	sections: "main > section[id]",
	revealItems:
		".project, .more-work, .testimonials blockquote, .service-grid article, .contact-card, [data-reveal]",
};

const VIEWPORT = {
	desktop: "(min-width: 901px)",
	mobile: "(max-width: 900px)",
};

const MOTION = {
	reducedMotionQuery: "(prefers-reduced-motion: reduce)",
	revealStart: "top 88%",
	revealEnd: "bottom 12%",
	revealToggleActions: "play none none none",
	ease: "power3.out",
};

const SPLIT_TEXT_CLASSES = {
	section: {
		wordsClass: "section-title-word",
		charsClass: "section-title-char",
	},
	intro: {
		wordsClass: "intro-loader__word",
		charsClass: "intro-loader__char",
	},
};

/* --------------------------------------------------------------------------
 * Shared utilities
 * -------------------------------------------------------------------------- */

const prefersReducedMotion = () =>
	window.matchMedia(MOTION.reducedMotionQuery).matches;

const isDesktopViewport = () => window.matchMedia(VIEWPORT.desktop).matches;

const hasAnimationLibraries = (...libraries) =>
	Boolean(window.gsap && libraries.every((library) => window[library]));

function splitElement(element, classNames, useMask = true) {
	return window.SplitText.create(element, {
		type: "words, chars",
		...(useMask && { mask: "chars" }),
		...classNames,
	});
}

function syncScrollAnimations() {
	window.ScrollTrigger?.update();
	// Numeric scrub animations otherwise continue easing after an instant nav jump.
	window.ScrollTrigger?.getAll().forEach((trigger) => {
		const scrubTween = trigger.getTween?.();

		if (typeof scrubTween?.progress === "function") {
			scrubTween.progress(1);
		}
	});
}

function jumpToScrollPosition(position, syncAnimations = false) {
	const root = document.documentElement;
	const scrollingElement = document.scrollingElement ?? root;
	const previousScrollBehavior = root.style.scrollBehavior;
	const applyPosition = () => {
		scrollingElement.scrollTop = position;
		if (syncAnimations) syncScrollAnimations();
	};

	root.style.scrollBehavior = "auto";
	applyPosition();

	requestAnimationFrame(() => {
		applyPosition();
		root.style.scrollBehavior = previousScrollBehavior;
	});
}

function createScrollReveal(element, options = {}) {
	if (!element) return null;

	return window.gsap.from(element, {
		y: options.y ?? 24,
		autoAlpha: 0,
		duration: options.duration ?? 0.45,
		ease: MOTION.ease,
		scrollTrigger: {
			trigger: element,
			start: options.start ?? MOTION.revealStart,
			end: options.end ?? MOTION.revealEnd,
			toggleActions: options.toggleActions ?? MOTION.revealToggleActions,
		},
	});
}

function createSplitTitleReveal(title, scrollTriggerOptions = {}) {
	const splitTitle = splitElement(title, SPLIT_TEXT_CLASSES.section);

	return window.gsap.from(splitTitle.chars, {
		yPercent: 110,
		rotate: 4,
		autoAlpha: 0,
		duration: 0.58,
		stagger: 0.025,
		ease: "power4.out",
		scrollTrigger: {
			trigger: title,
			start: "top 86%",
			toggleActions: MOTION.revealToggleActions,
			...scrollTriggerOptions,
		},
	});
}

/* --------------------------------------------------------------------------
 * Navigation
 * -------------------------------------------------------------------------- */

function initNavigation() {
	const sidebar = document.querySelector(".sidebar");
	const menuToggle = document.querySelector(".menu-toggle");
	const navLinks = [...document.querySelectorAll(SELECTORS.navLinks)];
	const sections = [...document.querySelectorAll(SELECTORS.sections)];
	const isHomepage = document.body.classList.contains("home-page");

	if (!sidebar || !menuToggle || !navLinks.length || !sections.length) return;

	const sectionPositions = new Map();
	// Cache flow positions before sticky transforms alter the rendered card state.
	const cacheSectionPositions = () => {
		sections.forEach((section) => {
			sectionPositions.set(section.id, section.offsetTop);
		});
	};
	const getSectionPosition = (section) => {
		const panelTrigger = window.ScrollTrigger?.getById(
			`panel-stack-${section.id}`,
		);

		if (panelTrigger) return panelTrigger.start;

		if (section === sections.at(-1)) {
			const previousSection = sections.at(-2);
			const previousTrigger = window.ScrollTrigger?.getById(
				`panel-stack-${previousSection?.id}`,
			);

			if (previousTrigger) return previousTrigger.end;
		}

		return sectionPositions.get(section.id) ?? section.offsetTop;
	};

	cacheSectionPositions();

	const closeMenu = () => {
		sidebar.classList.remove("open");
		menuToggle.setAttribute("aria-expanded", "false");
		menuToggle.setAttribute("aria-label", "Open navigation menu");
	};

	const setActiveLink = (sectionId) => {
		const activeLink =
			navLinks.find((link) => {
				const mappedSections = link.dataset.sections?.split(" ") ?? [];
				return (
					link.hash === `#${sectionId}` || mappedSections.includes(sectionId)
				);
			}) ?? navLinks[0];
		navLinks.forEach((link) => {
			const isActive = link === activeLink;
			link.classList.toggle("active", isActive);
			isActive
				? link.setAttribute("aria-current", "page")
				: link.removeAttribute("aria-current");
		});
	};

	menuToggle.addEventListener("click", () => {
		const isOpen = sidebar.classList.toggle("open");
		menuToggle.setAttribute("aria-expanded", String(isOpen));
		menuToggle.setAttribute(
			"aria-label",
			isOpen ? "Close navigation menu" : "Open navigation menu",
		);
	});

	navLinks.forEach((link) => {
		link.addEventListener("click", (event) => {
			closeMenu();

			if (!isHomepage || !link.hash) return;

			const targetSection = document.querySelector(link.hash);
			if (!targetSection) return;

			event.preventDefault();

			const isDesktop = isDesktopViewport();
			const targetPosition = getSectionPosition(targetSection);

			if (isDesktop) {
				jumpToScrollPosition(targetPosition, true);
			} else {
				window.scrollTo({
					top: targetPosition,
					behavior: prefersReducedMotion() ? "auto" : "smooth",
				});
			}

			setActiveLink(targetSection.id);
		});
	});
	document
		.querySelector(".mobile-nav-cta")
		?.addEventListener("click", closeMenu);

	document.addEventListener("click", (event) => {
		if (sidebar.classList.contains("open") && !sidebar.contains(event.target))
			closeMenu();
	});

	document.addEventListener("keydown", (event) => {
		if (event.key !== "Escape" || !sidebar.classList.contains("open")) return;
		closeMenu();
		menuToggle.focus();
	});

	const updateActiveSection = () => {
		if (document.body.classList.contains("intro-active")) {
			setActiveLink("home");
			return;
		}

		const mobileHeaderHeight = 82;
		const desktopSidebarWidth = 247;
		const isDesktop = isDesktopViewport();
		const probeX = isDesktop
			? desktopSidebarWidth + (window.innerWidth - desktopSidebarWidth) / 2
			: window.innerWidth / 2;
		const probeY = isDesktop
			? window.innerHeight / 2
			: mobileHeaderHeight + (window.innerHeight - mobileHeaderHeight) / 2;
		const visibleSection = document
			.elementFromPoint(probeX, probeY)
			?.closest("main > section[id]");

		if (visibleSection) {
			setActiveLink(visibleSection.id);
			return;
		}

		// Retain an offset-based fallback for browsers without a probeable panel.
		const scrollMarker = window.scrollY + window.innerHeight * 0.45;
		const activeSection = sections.reduce((current, section) => {
			return getSectionPosition(section) <= scrollMarker ? section : current;
		});

		setActiveLink(activeSection?.id || "home");
	};

	let scrollUpdatePending = false;
	const requestSectionUpdate = () => {
		if (scrollUpdatePending) return;
		scrollUpdatePending = true;

		requestAnimationFrame(() => {
			updateActiveSection();
			scrollUpdatePending = false;
		});
	};

	updateActiveSection();
	window.addEventListener("load", () => {
		if (!isHomepage) cacheSectionPositions();
		updateActiveSection();
	});
	window.addEventListener("resize", () => {
		if (isHomepage) {
			window.ScrollTrigger?.refresh();
		} else {
			cacheSectionPositions();
		}
		requestSectionUpdate();
	});
	window.addEventListener("scroll", requestSectionUpdate, { passive: true });
}

/* --------------------------------------------------------------------------
 * Contact modal and form
 * -------------------------------------------------------------------------- */

function initContactModal() {
	const modal = document.querySelector(SELECTORS.modal);
	const form = document.querySelector("[data-contact-form]");
	const formWrap = document.querySelector("#contactFormWrap");
	const successMessage = document.querySelector("#contactSuccess");
	const errorMessage = document.querySelector("#contactError");
	const backgroundContent = document.querySelectorAll(
		"body > header, body > main, body > footer",
	);

	if (!modal) return;

	let previouslyFocused = null;

	const resetModal = () => {
		successMessage?.classList.remove("contact-success--visible");
		formWrap?.classList.remove("contact-form-wrap--hidden");
		if (errorMessage) errorMessage.hidden = true;
	};

	const openModal = (trigger) => {
		resetModal();
		previouslyFocused = trigger ?? document.activeElement;
		modal.classList.add("contact-modal--open");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-open");
		backgroundContent.forEach((element) => {
			element.inert = true;
		});
		requestAnimationFrame(() =>
			modal
				.querySelector('input:not([type="hidden"]):not([tabindex="-1"])')
				?.focus(),
		);
	};

	const closeModal = () => {
		modal.classList.remove("contact-modal--open");
		modal.setAttribute("aria-hidden", "true");
		document.body.classList.remove("modal-open");
		backgroundContent.forEach((element) => {
			element.inert = false;
		});
		if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
	};

	const trapFocus = (event) => {
		if (event.key !== "Tab") return;

		const focusable = [
			...modal.querySelectorAll(
				"a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
			),
		].filter((element) => element.offsetParent !== null);

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

	document.addEventListener("click", (event) => {
		const actionElement =
			event.target instanceof Element
				? event.target.closest("[data-action]")
				: null;
		const action = actionElement?.dataset.action;

		if (action === "open-contact") openModal(actionElement);
		if (action === "close-contact" || event.target === modal) closeModal();
	});

	document.addEventListener("keydown", (event) => {
		if (!modal.classList.contains("contact-modal--open")) return;
		if (event.key === "Escape") closeModal();
		trapFocus(event);
	});

	form?.addEventListener("submit", async (event) => {
		event.preventDefault();

		const submitButton = form.querySelector('[type="submit"]');
		if (!(submitButton instanceof HTMLButtonElement)) return;

		const originalLabel = submitButton.innerHTML;
		if (errorMessage) errorMessage.hidden = true;
		submitButton.disabled = true;
		submitButton.textContent = "Sending…";

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});

			if (!response.ok) {
				throw new Error(`Form submission failed: ${response.status}`);
			}

			form.reset();
			formWrap?.classList.add("contact-form-wrap--hidden");
			successMessage?.classList.add("contact-success--visible");
			successMessage?.querySelector("button")?.focus();
		} catch (error) {
			if (errorMessage) errorMessage.hidden = false;
			console.error("Unable to submit the contact form.", error);
		} finally {
			submitButton.disabled = false;
			submitButton.innerHTML = originalLabel;
		}
	});
}

/* --------------------------------------------------------------------------
 * CSS fallback animations
 * -------------------------------------------------------------------------- */

function initLegacyScrollReveal() {
	const items = [...document.querySelectorAll(SELECTORS.revealItems)];

	items.forEach((item, index) => {
		item.classList.add("scroll-reveal");
		item.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
	});

	if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
		items.forEach((item) => item.classList.add("is-visible"));
		return;
	}

	const revealObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add("is-visible");
				revealObserver.unobserve(entry.target);
			});
		},
		{
			rootMargin: "0px 0px -10%",
			threshold: 0.12,
		},
	);

	items.forEach((item) => revealObserver.observe(item));
}

/* --------------------------------------------------------------------------
 * Homepage intro
 * -------------------------------------------------------------------------- */

function initPageIntro() {
	const loader = document.querySelector("[data-intro-loader]");
	const echoesContainer = loader?.querySelector("[data-intro-echoes]");
	const title = loader?.querySelector("[data-intro-title]");
	const brand = loader?.querySelector(".intro-loader__brand");
	const topPanel = loader?.querySelector(".intro-loader__panel--top");
	const bottomPanel = loader?.querySelector(".intro-loader__panel--bottom");

	if (!loader || !echoesContainer || !title || !topPanel || !bottomPanel) {
		return false;
	}

	if ("scrollRestoration" in window.history) {
		window.history.scrollRestoration = "manual";
	}
	// The splash always reveals the hero, regardless of restored scroll or hashes.
	window.history.replaceState(
		null,
		"",
		`${window.location.pathname}${window.location.search}#home`,
	);
	jumpToScrollPosition(0, true);

	loader.classList.add("intro-loader--active");
	document.body.classList.add("intro-active");

	const echoPositions = [
		[6, 12],
		[58, 9],
		[18, 31],
		[70, 38],
		[3, 68],
		[54, 72],
		[25, 88],
	];
	const echoSplits = echoPositions.map(([left, top]) => {
		const echo = document.createElement("p");
		const randomLeft = window.gsap.utils.clamp(
			2,
			72,
			left + window.gsap.utils.random(-5, 5, 0.5),
		);
		const randomTop = window.gsap.utils.clamp(
			4,
			90,
			top + window.gsap.utils.random(-5, 5, 0.5),
		);
		echo.className = "intro-loader__echo";
		echo.textContent = "FE Studios";
		echo.style.left = `${randomLeft}%`;
		echo.style.top = `${randomTop}%`;
		echo.style.rotate = `${window.gsap.utils.random(-5, 5, 0.5)}deg`;
		echoesContainer.append(echo);

		return splitElement(echo, SPLIT_TEXT_CLASSES.intro, false);
	});
	const titleSplit = splitElement(title, SPLIT_TEXT_CLASSES.intro, false);
	const timeline = window.gsap.timeline({
		onComplete() {
			jumpToScrollPosition(0, true);
			document.body.classList.remove("intro-active");
			loader.classList.add("intro-loader--complete");
			loader.remove();
			requestAnimationFrame(() => window.ScrollTrigger?.refresh());
		},
	});

	echoSplits.forEach((split, index) => {
		const startTime = index * 0.14;

		timeline
			.fromTo(
				split.chars,
				{ yPercent: () => window.gsap.utils.random(-80, 80), autoAlpha: 0 },
				{
					yPercent: 0,
					autoAlpha: 1,
					duration: 0.32,
					stagger: { each: 0.016, from: "random" },
					ease: "power2.out",
				},
				startTime,
			)
			.to(
				split.chars,
				{
					autoAlpha: 0,
					duration: 0.14,
					stagger: { each: 0.01, from: "random" },
				},
				startTime + 0.44,
			);
	});

	timeline
		.fromTo(
			titleSplit.chars,
			{ yPercent: () => window.gsap.utils.random(-120, 120), autoAlpha: 0 },
			{
				yPercent: 0,
				autoAlpha: 1,
				duration: 0.34,
				stagger: { each: 0.03, from: "random" },
				ease: "power3.out",
			},
			1.35,
		)
		.to(title, { scale: 1.035, duration: 0.25, ease: "power2.inOut" })
		.to(
			[echoesContainer, title],
			{
				autoAlpha: 0,
				duration: 0.18,
				ease: "power2.in",
			},
			"+=0.22",
		)
		.to(topPanel, { yPercent: -101, duration: 0.82, ease: "power4.inOut" })
		.to(
			bottomPanel,
			{ yPercent: 101, duration: 0.82, ease: "power4.inOut" },
			"<",
		)
		.to(brand, { autoAlpha: 0, duration: 0.32, ease: "power2.out" }, "<");

	return true;
}

/* --------------------------------------------------------------------------
 * Shared GSAP animations
 * -------------------------------------------------------------------------- */

function initAboutScrollAnimations() {
	const about = document.querySelector("#about");
	const revealGroups = about
		? [
				about.querySelector(".section-intro .eyebrow"),
				about.querySelector(".profile > div:first-child"),
				...about.querySelectorAll(".profile-copy p"),
				about.querySelector(".toolkit .eyebrow"),
				...about.querySelectorAll(".toolkit li"),
			].filter(Boolean)
		: [];
	if (!about || !revealGroups.length) return;

	revealGroups.forEach((group) => {
		createScrollReveal(group, {
			duration: 0.42,
			start: "top 86%",
			end: "bottom 14%",
			toggleActions: MOTION.revealToggleActions,
		});
	});
}

function initHeroParallax() {
	const hero = document.querySelector(
		".home-page #home, .work-page .work-hero, .services-page .services-hero",
	);
	const heroCopy = hero?.querySelector(
		".hero-copy, .work-hero__copy, .services-hero__copy",
	);
	const heroMark = hero?.querySelector(".hero-mark");

	if (!hero || !heroCopy || !heroMark) return;

	const isMobile = window.matchMedia(VIEWPORT.mobile).matches;

	window.gsap
		.timeline({
			scrollTrigger: {
				trigger: hero,
				start: "top top",
				end: "bottom top",
				scrub: 0.7,
				invalidateOnRefresh: true,
			},
		})
		.to(
			heroCopy,
			{
				y: isMobile ? 38 : 82,
				ease: "none",
			},
			0,
		)
		.to(
			heroMark,
			{
				y: isMobile ? -52 : -125,
				rotate: isMobile ? -2 : -5,
				scale: 1.05,
				ease: "none",
			},
			0,
		);
}

/* --------------------------------------------------------------------------
 * Standalone work, services and case-study pages
 * -------------------------------------------------------------------------- */

function initStandaloneHeroAnimation() {
	const hero = document.querySelector(
		".work-hero, .services-hero, .case-hero",
	);
	const heroCopy = hero?.querySelector(
		".work-hero__copy, .services-hero__copy, .case-hero__copy",
	);
	const title = heroCopy?.querySelector("h1");

	if (!hero || !heroCopy || !title) return;

	const splitTitle = splitElement(title, SPLIT_TEXT_CLASSES.section);
	const supportingContent = [...heroCopy.children].filter(
		(element) => element !== title,
	);
	const heroVisual = hero.querySelector(".case-hero__visual");

	window.gsap
		.timeline({ defaults: { ease: "power4.out" } })
		.from(splitTitle.chars, {
			yPercent: 110,
			rotate: 4,
			autoAlpha: 0,
			duration: 0.72,
			stagger: 0.025,
		})
		.from(
			supportingContent,
			{
				y: 24,
				autoAlpha: 0,
				duration: 0.52,
				stagger: 0.08,
			},
			"-=0.32",
		);

	if (heroVisual) {
		window.gsap.from(heroVisual, {
			x: 72,
			autoAlpha: 0,
			duration: 0.72,
			delay: 0.2,
			ease: MOTION.ease,
		});
	}
}

function initStandaloneSectionTitleAnimations() {
	const titleSelector = document.body.classList.contains("case-page")
		? ".case-page main section:not(.case-hero) h2:not(.sr-only)"
		: "main > .panel:not(:first-child) h2";
	const titles = document.querySelectorAll(titleSelector);

	titles.forEach((title) => {
		createSplitTitleReveal(title);
	});
}

function initStandaloneCardAnimations() {
	const cardSelectors = {
		"work-page":
			".portfolio-card, .work-testimonials blockquote, .work-about__portrait, .work-about__copy, .work-project-cta, .work-contact .contact-card",
		"case-page":
			".case-summary > *, .case-story__body, .case-insight, .case-feature__visual, .case-gallery figure, .case-deliverables article, .case-launch-asset, .case-intelligence__grid > *, .case-problem > *, .case-outcome > *, .case-next",
		"services-page":
			".service-offer, .pricing-list article, .process-grid > li, .care-grid article, .faq-list details, .services-contact .contact-card",
	};
	const pageClass = Object.keys(cardSelectors).find((className) =>
		document.body.classList.contains(className),
	);
	const selector = cardSelectors[pageClass];

	if (!selector) return;

	const cards = document.querySelectorAll(selector);

	cards.forEach((card, index) => {
		window.gsap.from(card, {
			x: -72,
			y: 20,
			scale: 0.975,
			autoAlpha: 0,
			duration: 0.62,
			delay: (index % 2) * 0.08,
			ease: MOTION.ease,
			scrollTrigger: {
				trigger: card,
				start: "top 88%",
				toggleActions: MOTION.revealToggleActions,
			},
		});
	});
}

async function initStandalonePageAnimations() {
	if (document.fonts?.ready) await document.fonts.ready;

	initStandaloneHeroAnimation();
	initStandaloneSectionTitleAnimations();
	initStandaloneCardAnimations();
	initHeroParallax();
	window.ScrollTrigger.refresh();
}

/* --------------------------------------------------------------------------
 * Homepage section-card animations
 * -------------------------------------------------------------------------- */

function initPanelStacking() {
	const panels = [...document.querySelectorAll(".home-page main > .panel")];
	if (panels.length < 2) return;

	const media = window.gsap.matchMedia();

	media.add(
		{
			desktop: VIEWPORT.desktop,
			mobile: VIEWPORT.mobile,
		},
		(context) => {
			const headerOffset = context.conditions.mobile ? 82 : 0;

			panels.slice(0, -1).forEach((panel) => {
				window.ScrollTrigger.create({
					id: `panel-stack-${panel.id}`,
					trigger: panel,
					start: "bottom bottom",
					end: headerOffset ? `bottom ${headerOffset}px` : "bottom top",
					pin: true,
					pinSpacing: false,
					anticipatePin: 1,
					invalidateOnRefresh: true,
				});
			});
		},
	);
}

function initWorkScrollAnimations() {
	const work = document.querySelector("#work");
	if (!work) return;

	[
		work.querySelector(".work-page-link"),
		work.querySelector(":scope > .eyebrow"),
		work.querySelector(".more-work"),
		work.querySelector(".testimonials-heading"),
	].forEach((element) => createScrollReveal(element));

	const projects = [...work.querySelectorAll(".project")];
	const testimonials = [...work.querySelectorAll(".testimonials blockquote")];

	if (projects.length) {
		const cardTimeline = window.gsap.timeline({
			delay: 0.06,
			scrollTrigger: {
				trigger: work.querySelector(".work-grid"),
				start: "top 86%",
				end: "bottom 14%",
				toggleActions: MOTION.revealToggleActions,
			},
		});

		projects.forEach((project, index) => {
			const cardPair = [project, testimonials[index]].filter(Boolean);

			cardTimeline.from(cardPair, {
				x: -90,
				autoAlpha: 0,
				duration: 0.56,
				ease: MOTION.ease,
			});
		});
	}
}

function initServicesScrollAnimations() {
	const services = document.querySelector("#services");
	if (!services) return;

	[
		...services.querySelectorAll(".services-intro > .eyebrow"),
		services.querySelector(".services-page-link"),
	].forEach((element) => createScrollReveal(element));

	const serviceCards = [...services.querySelectorAll(".service-grid article")];
	if (!serviceCards.length) return;

	const servicesTitle = services.querySelector("h2");
	const servicesTimeline = window.gsap.timeline({
		scrollTrigger: {
			trigger: services,
			start: "top 78%",
			end: "bottom 14%",
			toggleActions: MOTION.revealToggleActions,
		},
	});

	if (servicesTitle && hasAnimationLibraries("SplitText")) {
		const splitTitle = splitElement(
			servicesTitle,
			SPLIT_TEXT_CLASSES.section,
		);

		servicesTimeline.from(splitTitle.chars, {
			yPercent: 110,
			rotate: 4,
			autoAlpha: 0,
			duration: 0.58,
			stagger: 0.025,
			ease: "power4.out",
		});
	}

	servicesTimeline.from(
		serviceCards,
		{
			y: 54,
			scale: 0.96,
			autoAlpha: 0,
			duration: 0.62,
			stagger: 0.12,
			ease: MOTION.ease,
		},
		"-=0.12",
	);
}

function initSectionTitleAnimations() {
	const titles = document.querySelectorAll("#about h2, #work h2, #contact h2");

	titles.forEach((title) => {
		createSplitTitleReveal(title, { end: "bottom 14%" });
	});
}

function initContactScrollAnimations() {
	const contact = document.querySelector("#contact");
	if (!contact) return;

	const contactHeading = contact.querySelector(".contact-heading");
	const contactCard = contact.querySelector(".contact-card");
	const contactLinks = contact.querySelectorAll("address a");

	contactLinks.forEach((link) => createScrollReveal(link));

	if (!contactHeading || !contactCard) return;

	window.gsap
		.timeline({
			scrollTrigger: {
				trigger: contact,
				start: "top 78%",
				end: "bottom 16%",
				toggleActions: MOTION.revealToggleActions,
			},
			defaults: { duration: 0.68, ease: MOTION.ease },
		})
		.from(contactHeading, { xPercent: -65, autoAlpha: 0 })
		.from(contactCard, { xPercent: 65, autoAlpha: 0 });
}

/* --------------------------------------------------------------------------
 * Animation bootstrap
 * -------------------------------------------------------------------------- */

function initAnimations() {
	const isHomepage = Boolean(document.querySelector("#home"));
	const isStandalonePage = document.body.matches(
		".work-page, .services-page, .case-page",
	);
	const introLoader = document.querySelector("[data-intro-loader]");
	const hasSplitText = hasAnimationLibraries("SplitText");
	const hasScrollTrigger = hasAnimationLibraries("ScrollTrigger");

	if (!isHomepage && !isStandalonePage) {
		initLegacyScrollReveal();
		return;
	}

	if (prefersReducedMotion()) {
		introLoader?.remove();
		return;
	}

	if (isStandalonePage) {
		if (hasSplitText && hasScrollTrigger) {
			window.gsap.registerPlugin(window.SplitText, window.ScrollTrigger);
			void initStandalonePageAnimations();
		} else {
			initLegacyScrollReveal();
		}

		return;
	}

	if (hasSplitText) {
		window.gsap.registerPlugin(window.SplitText);
		initPageIntro();
	} else {
		introLoader?.remove();
	}

	if (hasScrollTrigger) {
		window.gsap.registerPlugin(window.ScrollTrigger);
		initHeroParallax();
		initPanelStacking();
		initAboutScrollAnimations();
		initWorkScrollAnimations();
		initServicesScrollAnimations();
		initContactScrollAnimations();

		if (hasSplitText) {
			initSectionTitleAnimations();
		}
	}
}

/* --------------------------------------------------------------------------
 * Application entry point
 * -------------------------------------------------------------------------- */

initNavigation();
initContactModal();
initAnimations();
