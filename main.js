// Nav: glass effect on scroll
const pill = document.getElementById("navPill");
window.addEventListener(
	"scroll",
	() => {
		pill.classList.toggle("scrolled", window.scrollY > 12);
	},
	{ passive: true },
);

// Mobile menu toggle
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");

burger.addEventListener("click", () => {
	const open = mobileNav.classList.toggle("open");
	burger.classList.toggle("open", open);
	burger.setAttribute("aria-expanded", open);
});

// Close mobile menu when any link inside it is clicked
mobileNav.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		mobileNav.classList.remove("open");
		burger.classList.remove("open");
		burger.setAttribute("aria-expanded", "false");
	});
});

// Reveal elements on scroll
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((e) => {
			if (e.isIntersecting) {
				e.target.classList.add("in");
				observer.unobserve(e.target);
			}
		});
	},
	{ threshold: 0.1, rootMargin: "-50px" },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ─── Contact modal ───
const overlay = document.getElementById("contactModal");
const modalCard = overlay.querySelector(".modal-card");
const closeBtn = document.getElementById("modalClose");
const form = document.getElementById("contactForm");
const formWrap = document.getElementById("modalFormWrap");
const successEl = document.getElementById("modalSuccess");
const doneBtn = document.getElementById("modalDone");
const submitBtn = document.getElementById("formSubmit");
const submitText = document.getElementById("submitText");
const errorEl = document.getElementById("formError");

// Replace YOUR_FORMSPREE_ID after creating a free form at formspree.io
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqgnbpe";

function openModal() {
	overlay.classList.add("open");
	overlay.removeAttribute("aria-hidden");
	document.body.style.overflow = "hidden";
	setTimeout(() => closeBtn.focus(), 50);
}

function closeModal() {
	overlay.classList.remove("open");
	overlay.setAttribute("aria-hidden", "true");
	document.body.style.overflow = "";
}

function resetModal() {
	form.reset();
	errorEl.hidden = true;
	formWrap.hidden = false;
	successEl.hidden = true;
	submitBtn.disabled = false;
	submitText.textContent = "Send enquiry";
	form.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
}

document.querySelectorAll(".js-open-contact").forEach((btn) => {
	btn.addEventListener("click", () => {
		resetModal();
		openModal();
	});
});

closeBtn.addEventListener("click", closeModal);
doneBtn.addEventListener("click", () => {
	closeModal();
	setTimeout(resetModal, 350);
});

overlay.addEventListener("click", (e) => {
	if (e.target === overlay) closeModal();
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
});

function validateForm() {
	let valid = true;
	["cf-name", "cf-email", "cf-message"].forEach((id) => {
		const el = document.getElementById(id);
		if (!el.value.trim()) {
			el.classList.add("error");
			valid = false;
		} else el.classList.remove("error");
	});
	const email = document.getElementById("cf-email");
	if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
		email.classList.add("error");
		valid = false;
	}
	return valid;
}

form.addEventListener("submit", async (e) => {
	e.preventDefault();
	errorEl.hidden = true;
	if (!validateForm()) return;

	submitBtn.disabled = true;
	submitText.textContent = "Sending…";

	try {
		const res = await fetch(FORMSPREE_ENDPOINT, {
			method: "POST",
			headers: { Accept: "application/json" },
			body: new FormData(form),
		});

		if (res.ok) {
			formWrap.hidden = true;
			successEl.hidden = false;
		} else {
			throw new Error("non-ok response");
		}
	} catch {
		errorEl.hidden = false;
		submitBtn.disabled = false;
		submitText.textContent = "Send enquiry";
	}
});
