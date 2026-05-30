import { logos } from "@/assets/logos";

const links = [
	{ label: "Work", href: "#work" },
	{ label: "Services", href: "#services" },
	{ label: "Process", href: "#process" },
	{ label: "FAQ", href: "#faq" },
	{ label: "Contact", href: "#contact" },
];

export default function Footer() {
	return (
		<footer className="shell pb-12 pt-16">
			<div className="h-px w-full bg-line" />
			<div className="flex flex-col gap-10 pt-12 sm:flex-row sm:items-start sm:justify-between">
				<div className="max-w-xs">
					<img
						src={logos.wordmarkOnLight}
						alt="FE Studios"
						width={420}
						height={210}
						loading="lazy"
						decoding="async"
						className="h-8 w-auto"
						draggable={false}
					/>
					<p className="mt-4 text-[15px] leading-relaxed text-mist">
						Website design, app development, and UI/UX design for businesses
						that want their digital presence to feel current, clear, and
						credible.
					</p>
				</div>

				<nav className="flex flex-col gap-3">
					<span className="text-[11px] font-medium uppercase tracking-label text-graphite">
						Navigate
					</span>
					{links.map((l) => (
						<a
							key={l.label}
							href={l.href}
							className="text-[15px] text-graphite transition-colors hover:text-ink">
							{l.label}
						</a>
					))}
				</nav>
			</div>

			<div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between">
				<p>&copy; 2026 FE Studios. All rights reserved.</p>
				<p className="text-[13px] uppercase tracking-label">
					Designed &amp; built in-house
				</p>
			</div>
		</footer>
	);
}
