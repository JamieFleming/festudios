"use strict";

const SELECTORS = {
	modal: "#contactModal",
	navLinks: "#site-nav a",
	sections: "main > section[id]",
	revealItems:
		".project, .more-work, .testimonials blockquote, .service-grid article, .contact-card, [data-reveal]",
};

const MOTION = {
	reducedMotionQuery: "(prefers-reduced-motion: reduce)",
	revealStart: "top 88%",
	revealEnd: "bottom 12%",
	reversibleActions: "play none none none",
	ease: "power3.out",
};

const prefersReducedMotion = () =>
	window.matchMedia(MOTION.reducedMotionQuery).matches;

const hasAnimationLibraries = (...libraries) =>
	Boolean(window.gsap && libraries.every((library) => window[library]));

function createReversibleReveal(element, options = {}) {
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
			toggleActions: options.toggleActions ?? MOTION.reversibleActions,
		},
	});
}

function initNavigation() {
	const sidebar = document.querySelector(".sidebar");
	const menuToggle = document.querySelector(".menu-toggle");
	const navLinks = [...document.querySelectorAll(SELECTORS.navLinks)];
	const sections = document.querySelectorAll(SELECTORS.sections);

	if (!sidebar || !menuToggle || !navLinks.length || !sections.length) return;

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
		const nav = activeLink.closest("nav");

		navLinks.forEach((link) => {
			const isActive = link === activeLink;
			link.classList.toggle("active", isActive);
			isActive
				? link.setAttribute("aria-current", "page")
				: link.removeAttribute("aria-current");
		});

		nav?.style.setProperty("--indicator-y", `${activeLink.offsetTop}px`);
		nav?.style.setProperty(
			"--indicator-height",
			`${activeLink.offsetHeight}px`,
		);
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

			if (!document.body.classList.contains("home-page") || !link.hash) return;

			const targetSection = document.querySelector(link.hash);
			if (!targetSection) return;

			event.preventDefault();

			const hasHorizontalEntry = ["work", "services"].includes(
				targetSection.id,
			);
			const entryOffset =
				hasHorizontalEntry && window.matchMedia("(min-width: 901px)").matches
					? window.innerHeight * 0.65
					: 0;

			window.scrollTo({
				top: targetSection.offsetTop + entryOffset,
				behavior: prefersReducedMotion() ? "auto" : "smooth",
			});
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
		const scrollMarker = window.scrollY + window.innerHeight * 0.45;
		const activeSection = [...sections].reduce((current, section) =>
			section.offsetTop <= scrollMarker ? section : current,
		);

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
	window.addEventListener("load", updateActiveSection);
	window.addEventListener("resize", requestSectionUpdate);
	window.addEventListener("scroll", requestSectionUpdate, { passive: true });
}

function initContactModal() {
	const modal = document.querySelector(SELECTORS.modal);
	const form = document.querySelector("[data-contact-form]");
	const formWrap = document.querySelector("#contactFormWrap");
	const successMessage = document.querySelector("#contactSuccess");
	const errorMessage = document.querySelector("#contactError");

	if (!modal) return;

	let previouslyFocused = null;

	const resetModal = () => {
		successMessage?.classList.remove("contact-success--visible");
		formWrap?.classList.remove("contact-form-wrap--hidden");
	};

	const openModal = (trigger) => {
		resetModal();
		previouslyFocused = trigger ?? document.activeElement;
		modal.classList.add("contact-modal--open");
		modal.setAttribute("aria-hidden", "false");
		document.body.classList.add("modal-open");
		document
			.querySelectorAll("body > header, body > main, body > footer")
			.forEach((element) => {
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
		document
			.querySelectorAll("body > header, body > main, body > footer")
			.forEach((element) => {
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

			if (!response.ok)
				throw new Error(`Form submission failed: ${response.status}`);

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

		return window.SplitText.create(echo, {
			type: "words, chars",
			wordsClass: "intro-loader__word",
			charsClass: "intro-loader__char",
		});
	});
	const titleSplit = window.SplitText.create(title, {
		type: "words, chars",
		wordsClass: "intro-loader__word",
		charsClass: "intro-loader__char",
	});
	const timeline = window.gsap.timeline({
		onComplete() {
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

function initAboutScrollAnimation() {
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
		createReversibleReveal(group, {
			duration: 0.42,
			start: "top 86%",
			end: "bottom 14%",
			toggleActions: MOTION.reversibleActions,
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

	const isMobile = window.matchMedia("(max-width: 900px)").matches;

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

function initStandaloneHeroAnimation() {
	const hero = document.querySelector(
		".work-hero, .services-hero, .case-hero",
	);
	const heroCopy = hero?.querySelector(
		".work-hero__copy, .services-hero__copy, .case-hero__copy",
	);
	const title = heroCopy?.querySelector("h1");

	if (!hero || !heroCopy || !title) return;

	const splitTitle = window.SplitText.create(title, {
		type: "words, chars",
		mask: "chars",
		wordsClass: "section-title-word",
		charsClass: "section-title-char",
	});
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
		const splitTitle = window.SplitText.create(title, {
			type: "words, chars",
			mask: "chars",
			wordsClass: "section-title-word",
			charsClass: "section-title-char",
		});

		window.gsap.from(splitTitle.chars, {
			yPercent: 110,
			rotate: 4,
			autoAlpha: 0,
			duration: 0.58,
			stagger: 0.025,
			ease: "power4.out",
			scrollTrigger: {
				trigger: title,
				start: "top 86%",
				toggleActions: MOTION.reversibleActions,
			},
		});
	});
}

function initStandaloneCardAnimations() {
	const isWorkPage = document.body.classList.contains("work-page");
	const isCasePage = document.body.classList.contains("case-page");
	const selector = isWorkPage
		? ".portfolio-card, .work-testimonials blockquote, .work-about__portrait, .work-about__copy, .work-project-cta, .work-contact .contact-card"
		: isCasePage
			? ".case-summary > *, .case-story__body, .case-insight, .case-feature__visual, .case-gallery figure, .case-deliverables article, .case-launch-asset, .case-intelligence__grid > *, .case-problem > *, .case-outcome > *, .case-next"
			: ".service-offer, .pricing-list article, .process-grid > li, .care-grid article, .faq-list details, .services-contact .contact-card";
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
				toggleActions: MOTION.reversibleActions,
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

function initPanelExitAnimations() {
	const panels = [...document.querySelectorAll(".home-page main > .panel")];
	if (panels.length < 2) return;

	const isMobile = window.matchMedia("(max-width: 900px)").matches;

	panels.slice(0, -1).forEach((panel, index) => {
		const nextPanel = panels[index + 1];
		const content = [...panel.children].filter(
			(element) => !element.classList.contains("hero-mark"),
		);

		if (!content.length) return;

		window.gsap.to(content, {
			xPercent: isMobile ? -18 : -32,
			autoAlpha: 0,
			stagger: 0.04,
			ease: "none",
			scrollTrigger: {
				trigger: nextPanel,
				start: isMobile ? "top 82%" : "top 72%",
				end: isMobile ? "top 18%" : "top 12%",
				scrub: 0.6,
				invalidateOnRefresh: true,
			},
		});
	});
}

function initDesktopPanelEntryAnimations() {
	const panelTransitions = [
		{ panel: document.querySelector("#work"), xPercent: 100 },
		{ panel: document.querySelector("#services"), xPercent: -100 },
	];

	window.gsap.matchMedia().add("(min-width: 901px)", () => {
		panelTransitions.forEach(({ panel, xPercent }) => {
			if (!panel) return;

			window.gsap.fromTo(
				panel,
				{ xPercent },
				{
					xPercent: 0,
					ease: "none",
					scrollTrigger: {
						trigger: panel,
						start: "top top",
						end: () => `+=${window.innerHeight * 0.65}`,
						scrub: 0.7,
						invalidateOnRefresh: true,
					},
				},
			);
		});
	});
}

function initWorkScrollAnimations() {
	const work = document.querySelector("#work");
	if (!work) return;

	[
		work.querySelector(".work-page-link"),
		work.querySelector(":scope > .eyebrow"),
		work.querySelector(".more-work"),
		work.querySelector(".testimonials-heading"),
	].forEach((element) => createReversibleReveal(element));

	const projects = [...work.querySelectorAll(".project")];
	const testimonials = [...work.querySelectorAll(".testimonials blockquote")];

	if (projects.length) {
		const cardTimeline = window.gsap.timeline({
			delay: 0.14,
			scrollTrigger: {
				trigger: work.querySelector(".work-grid"),
				start: "top 86%",
				end: "bottom 14%",
				toggleActions: MOTION.reversibleActions,
			},
		});

		projects.forEach((project, index) => {
			const cardPair = [project, testimonials[index]].filter(Boolean);

			cardTimeline.from(cardPair, {
				x: -90,
				autoAlpha: 0,
				duration: 0.82,
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
	].forEach((element) => createReversibleReveal(element));

	const serviceCards = [...services.querySelectorAll(".service-grid article")];
	if (!serviceCards.length) return;

	const servicesTitle = services.querySelector("h2");
	const servicesTimeline = window.gsap.timeline({
		scrollTrigger: {
			trigger: services,
			start: "top 78%",
			end: "bottom 14%",
			toggleActions: MOTION.reversibleActions,
		},
	});

	if (servicesTitle && hasAnimationLibraries("SplitText")) {
		const splitTitle = window.SplitText.create(servicesTitle, {
			type: "words, chars",
			mask: "chars",
			wordsClass: "section-title-word",
			charsClass: "section-title-char",
		});

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
		const splitTitle = window.SplitText.create(title, {
			type: "words, chars",
			mask: "chars",
			wordsClass: "section-title-word",
			charsClass: "section-title-char",
		});

		window.gsap.from(splitTitle.chars, {
			yPercent: 110,
			rotate: 4,
			autoAlpha: 0,
			duration: 0.58,
			stagger: 0.025,
			ease: "power4.out",
			scrollTrigger: {
				trigger: title,
				start: "top 86%",
				end: "bottom 14%",
				toggleActions: MOTION.reversibleActions,
			},
		});
	});
}

function initContactScrollAnimations() {
	const contact = document.querySelector("#contact");
	if (!contact) return;

	const contactHeading = contact.querySelector(".contact-heading");
	const contactCard = contact.querySelector(".contact-card");
	const contactLinks = contact.querySelectorAll("address a");

	contactLinks.forEach((link) => createReversibleReveal(link));

	if (!contactHeading || !contactCard) return;

	window.gsap
		.timeline({
			scrollTrigger: {
				trigger: contact,
				start: "top 78%",
				end: "bottom 16%",
				toggleActions: MOTION.reversibleActions,
			},
			defaults: { duration: 0.68, ease: MOTION.ease },
		})
		.from(contactHeading, { xPercent: -65, autoAlpha: 0 })
		.from(contactCard, { xPercent: 65, autoAlpha: 0 });
}

function initAnimations() {
	const isHomepage = Boolean(document.querySelector("#home"));
	const isStandalonePage = document.body.matches(
		".work-page, .services-page, .case-page",
	);
	const introLoader = document.querySelector("[data-intro-loader]");

	if (!isHomepage && !isStandalonePage) {
		initLegacyScrollReveal();
		return;
	}

	if (prefersReducedMotion()) {
		introLoader?.remove();
		return;
	}

	if (isStandalonePage) {
		if (
			hasAnimationLibraries("SplitText") &&
			hasAnimationLibraries("ScrollTrigger")
		) {
			window.gsap.registerPlugin(window.SplitText, window.ScrollTrigger);
			void initStandalonePageAnimations();
		} else {
			initLegacyScrollReveal();
		}

		return;
	}

	if (hasAnimationLibraries("SplitText")) {
		window.gsap.registerPlugin(window.SplitText);
		initPageIntro();
	} else {
		introLoader?.remove();
	}

	if (hasAnimationLibraries("ScrollTrigger")) {
		window.gsap.registerPlugin(window.ScrollTrigger);
		initHeroParallax();
		initDesktopPanelEntryAnimations();
		initPanelExitAnimations();
		initAboutScrollAnimation();
		initWorkScrollAnimations();
		initServicesScrollAnimations();
		initContactScrollAnimations();

		if (hasAnimationLibraries("SplitText")) {
			initSectionTitleAnimations();
		}
	}
}

initNavigation();
initContactModal();
initAnimations();
