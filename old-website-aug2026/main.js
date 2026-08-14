/**
 * FE Studios site interactions.
 * Presentation is controlled by CSS state classes; JavaScript only manages
 * behaviour and accessibility state.
 */
(() => {
	"use strict";

	const SELECTORS = {
		header: "#siteHeader",
		carousel: "[data-work-carousel]",
		track: "[data-work-track]",
		previous: "[data-work-previous]",
		next: "[data-work-next]",
		modal: "#contactModal",
		contactForm: "[data-contact-form]",
		formWrap: "#contactFormWrap",
		success: "#contactSuccess",
		error: "#contactError",
	};

	const CLASS_NAMES = {
		headerScrolled: "site-header--scrolled",
		modalOpen: "contact-modal--open",
		bodyModalOpen: "modal-open",
		formHidden: "contact-form-wrap--hidden",
		successVisible: "contact-success--visible",
	};

	let contactModal = null;
	let previouslyFocusedElement = null;

	function initHeader() {
		const header = document.querySelector(SELECTORS.header);
		if (!header) return;

		const updateHeader = () => {
			header.classList.toggle(CLASS_NAMES.headerScrolled, window.scrollY > 12);
		};

		window.addEventListener("scroll", updateHeader, { passive: true });
		updateHeader();
	}

	function initCarousels() {
		document.querySelectorAll(SELECTORS.carousel).forEach((carousel) => {
			const track = carousel.querySelector(SELECTORS.track);
			const previousButton = carousel.querySelector(SELECTORS.previous);
			const nextButton = carousel.querySelector(SELECTORS.next);
			const firstCard = track?.querySelector(".work-card");

			if (!track || !previousButton || !nextButton || !firstCard) return;

			const updateControls = () => {
				const maximumScroll = track.scrollWidth - track.clientWidth;
				previousButton.disabled = track.scrollLeft <= 2;
				nextButton.disabled = track.scrollLeft >= maximumScroll - 2;
			};

			const scrollByCard = (direction) => {
				const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
				const distance = firstCard.getBoundingClientRect().width + gap;
				track.scrollBy({ left: distance * direction, behavior: "smooth" });
			};

			previousButton.addEventListener("click", () => scrollByCard(-1));
			nextButton.addEventListener("click", () => scrollByCard(1));
			track.addEventListener("scroll", updateControls, { passive: true });
			window.addEventListener("resize", updateControls);
			updateControls();
		});
	}

	function openContactModal(trigger) {
		if (!contactModal) return;

		previouslyFocusedElement = trigger ?? document.activeElement;
		contactModal.classList.add(CLASS_NAMES.modalOpen);
		contactModal.setAttribute("aria-hidden", "false");
		document.body.classList.add(CLASS_NAMES.bodyModalOpen);

		requestAnimationFrame(() => {
			contactModal.querySelector("input")?.focus();
		});
	}

	function closeContactModal() {
		if (!contactModal) return;

		contactModal.classList.remove(CLASS_NAMES.modalOpen);
		contactModal.setAttribute("aria-hidden", "true");
		document.body.classList.remove(CLASS_NAMES.bodyModalOpen);

		if (previouslyFocusedElement instanceof HTMLElement) {
			previouslyFocusedElement.focus();
		}
	}

	function keepFocusInsideModal(event) {
		if (event.key !== "Tab" || !contactModal) return;

		const focusableElements = Array.from(
			contactModal.querySelectorAll(
				'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
			),
		).filter((element) => element.offsetParent !== null);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements.at(-1);

		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	}

	async function submitContactForm(event) {
		event.preventDefault();

		const form = event.currentTarget;
		const formWrap = document.querySelector(SELECTORS.formWrap);
		const success = document.querySelector(SELECTORS.success);
		const error = document.querySelector(SELECTORS.error);
		const submitButton = form.querySelector('[type="submit"]');
		const originalLabel = submitButton?.textContent ?? "Send enquiry";

		if (error) error.hidden = true;
		if (submitButton) {
			submitButton.disabled = true;
			submitButton.textContent = "Sending…";
		}

		try {
			const response = await fetch(form.action, {
				method: form.method,
				body: new FormData(form),
				headers: { Accept: "application/json" },
			});

			if (!response.ok) throw new Error(`Form submission failed: ${response.status}`);

			form.reset();
			formWrap?.classList.add(CLASS_NAMES.formHidden);
			success?.classList.add(CLASS_NAMES.successVisible);
			success?.querySelector("button")?.focus();
		} catch (submissionError) {
			if (error) error.hidden = false;
			console.error("Unable to submit the contact form.", submissionError);
		} finally {
			if (submitButton) {
				submitButton.disabled = false;
				submitButton.textContent = originalLabel;
			}
		}
	}

	function initContactModal() {
		contactModal = document.querySelector(SELECTORS.modal);
		if (!contactModal) return;

		document.addEventListener("click", (event) => {
			const actionElement =
				event.target instanceof Element
					? event.target.closest("[data-action]")
					: null;
			const action = actionElement?.dataset.action;

			if (action === "open-contact") openContactModal(actionElement);
			if (action === "close-contact" || event.target === contactModal) {
				closeContactModal();
			}
		});

		document.addEventListener("keydown", (event) => {
			if (!contactModal.classList.contains(CLASS_NAMES.modalOpen)) return;

			if (event.key === "Escape") closeContactModal();
			keepFocusInsideModal(event);
		});

		document
			.querySelector(SELECTORS.contactForm)
			?.addEventListener("submit", submitContactForm);
	}

	function init() {
		initHeader();
		initCarousels();
		initContactModal();
	}

	document.addEventListener("DOMContentLoaded", init);
})();
