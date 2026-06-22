import { m } from "framer-motion";
import { logos } from "@/assets/logos";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
	return (
		<section
			id="top"
			className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute inset-x-0 top-0 h-px bg-line" />
				{/* colour glow — sits under the white overlay */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 75% 65% at 80% -10%, rgba(99,120,255,0.28) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at -5% 40%, rgba(139,92,246,0.14) 0%, transparent 60%)",
					}}
				/>
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(247,247,245,0)_52%)]" />
				<div
					className="absolute inset-0 opacity-[0.32]"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(10,10,11,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.04) 1px, transparent 1px)",
						backgroundSize: "72px 72px",
						maskImage: "linear-gradient(to bottom, black, transparent 78%)",
						WebkitMaskImage:
							"linear-gradient(to bottom, black, transparent 78%)",
					}}
				/>
				<img
					src={logos.monogramOnLight}
					alt=""
					aria-hidden
					width={480}
					height={480}
					decoding="async"
					className="absolute right-[-6%] top-[8%] w-[42vw] max-w-[560px] opacity-[0.035] sm:opacity-[0.04]"
					draggable={false}
				/>
			</div>

			<div className="shell">
				<h1 className="max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-tighter2 sm:text-6xl lg:text-[4.4rem]">
					{["From a rough idea.", "To something work showing off."].map(
						(line, li) => (
							<span key={li} className="block overflow-hidden">
								<m.span
									className="block"
									initial={{ y: "110%" }}
									animate={{ y: 0 }}
									transition={{ duration: 0.9, ease, delay: 0.1 + li * 0.08 }}>
									{li === 1 ? (
										<>
											To something worth{" "}
											<span className="text-accent">showing off.</span>
										</>
									) : (
										line
									)}
								</m.span>
							</span>
						),
					)}
				</h1>

				<m.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.35 }}
					className="mt-6 max-w-xl text-[17px] leading-relaxed text-mist">
					FE Studios helps UK businesses and founders turn rough ideas into
					clear, polished websites, apps, and digital products. Strategy, UI/UX
					design, build, and launch handled with the same eye for detail.
				</m.p>

				<m.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.45 }}
					className="mt-9 flex flex-wrap items-center gap-3">
					<a href="#contact" className="btn-primary px-6 py-3">
						Get a project quote
					</a>
					<a href="#work" className="btn-ghost px-6 py-3">
						See recent work
					</a>
				</m.div>

				<m.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.7 }}
					className="relative mt-16 h-px w-full overflow-hidden bg-line sm:mt-24">
					<span className="absolute top-0 h-px w-24 bg-accent/70" />
				</m.div>

				<m.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.8 }}
					className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
					{[
						["Designed to convert", "Not just pretty but purposeful"],
						["Modern design", "Distinct, not templated"],
						["Reliable build", "Responsive and tidy"],
						["Launch ready", "Tested and handed over"],
					].map(([title, sub]) => (
						<div key={title}>
							<p className="text-sm font-medium text-ink">{title}</p>
							<p className="mt-1 text-sm text-haze">{sub}</p>
						</div>
					))}
				</m.div>
			</div>
		</section>
	);
}
