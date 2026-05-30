import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { logos } from "@/assets/logos";

const NAV = [
	{ label: "Work", href: "#work" },
	{ label: "Services", href: "#services" },
	{ label: "Process", href: "#process" },
	{ label: "Contact", href: "#contact" },
];

export default function Header() {
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header className="fixed inset-x-0 top-0 z-50">
			<div className="shell">
				<div
					className={`mt-3 flex items-center justify-between rounded-full border px-3 py-2 pl-5 transition-all duration-500 ease-smooth sm:mt-4 ${
						scrolled
							? "border-line bg-white/70 shadow-glass backdrop-blur-xl"
							: "border-transparent bg-transparent"
					}`}>
					<a
						href="#top"
						className="flex items-center"
						aria-label="FE Studios home">
						<img
							src={logos.wordmarkOnLight}
							alt="FE Studios"
							width={420}
							height={210}
							className="h-14 w-auto select-none sm:h-16"
							draggable={false}
						/>
					</a>

					<nav className="hidden items-center gap-1 md:flex">
						{NAV.map((item) => (
							<a
								key={item.label}
								href={item.href}
								className="rounded-full px-3.5 py-2 text-sm text-graphite transition-colors duration-300 hover:text-ink">
								{item.label}
							</a>
						))}
					</nav>

					<div className="flex items-center gap-2">
						<a href="#contact" className="btn-primary hidden sm:inline-flex">
							Get a quote
						</a>
						<button
							type="button"
							aria-label="Toggle menu"
							aria-expanded={open}
							onClick={() => setOpen((v) => !v)}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/60 backdrop-blur md:hidden">
							<div className="relative h-3 w-4">
								<span
									className={`absolute left-0 top-0 h-px w-4 bg-ink transition-all duration-300 ${
										open ? "translate-y-1.5 rotate-45" : ""
									}`}
								/>
								<span
									className={`absolute bottom-0 left-0 h-px w-4 bg-ink transition-all duration-300 ${
										open ? "-translate-y-1.5 -rotate-45" : ""
									}`}
								/>
							</div>
						</button>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{open && (
					<m.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
						className="shell md:hidden">
						<div className="mt-2 rounded-3xl border border-line bg-white/80 p-3 shadow-glass backdrop-blur-xl">
							{NAV.map((item) => (
								<a
									key={item.label}
									href={item.href}
									onClick={() => setOpen(false)}
									className="block rounded-2xl px-4 py-3 text-[15px] text-graphite transition-colors hover:bg-paper hover:text-ink">
									{item.label}
								</a>
							))}
							<a
								href="#contact"
								onClick={() => setOpen(false)}
								className="btn-primary mt-1 w-full">
								Get a quote
							</a>
						</div>
					</m.div>
				)}
			</AnimatePresence>
		</header>
	);
}
