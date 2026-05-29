import { motion } from "framer-motion";
import { logos } from "@/assets/logos";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
	return (
		<section
			id="top"
			className="relative overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
			{/* Abstract background: gradient mesh, grid lines, monogram watermark */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute left-1/2 top-[-12%] h-[520px] w-[820px] max-w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,108,246,0.10),transparent)] blur-2xl" />
				<div className="absolute right-[-10%] top-[20%] h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(10,10,11,0.06),transparent)] blur-2xl animate-float" />
				<div
					className="absolute inset-0 opacity-[0.5]"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(10,10,11,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.035) 1px, transparent 1px)",
						backgroundSize: "64px 64px",
						maskImage:
							"radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)",
						WebkitMaskImage:
							"radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent 75%)",
					}}
				/>
				<img
					src={logos.monogramOnLight}
					alt=""
					aria-hidden
					className="absolute right-[-6%] top-[8%] w-[42vw] max-w-[560px] opacity-[0.035] sm:opacity-[0.04]"
					draggable={false}
				/>
			</div>

			<div className="shell">
				<motion.div
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease }}
					className="mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-accent/10 px-3.5 py-1.5 backdrop-blur">
					<span className="h-1.5 w-1.5 rounded-full bg-accent" />
					<span className="text-[11px] font-medium uppercase tracking-label text-mist">
						Websites, apps &amp; product design
					</span>
				</motion.div>

				<h1 className="mt-7 max-w-4xl text-balance text-[2.6rem] font-semibold leading-[1.04] tracking-tighter2 sm:text-6xl lg:text-[4.4rem]">
					{["Websites and apps that", "look sharp and work hard."].map(
						(line, li) => (
							<span key={li} className="block overflow-hidden">
								<motion.span
									className="block"
									initial={{ y: "110%" }}
									animate={{ y: 0 }}
									transition={{ duration: 0.9, ease, delay: 0.1 + li * 0.08 }}>
									{li === 1 ? (
										<>
											look sharp and{" "}
											<span className="text-accent">work hard.</span>
										</>
									) : (
										line
									)}
								</motion.span>
							</span>
						),
					)}
				</h1>

				<motion.p
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.35 }}
					className="mt-6 max-w-xl text-[17px] leading-relaxed text-mist">
					FE Studios designs and builds clean, high-performing websites and
					apps for businesses, startups, and founders who need more than a
					generic template.
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.45 }}
					className="mt-9 flex flex-wrap items-center gap-3">
					<a href="#contact" className="btn-primary px-6 py-3">
						Start a project
					</a>
					<a href="#work" className="btn-ghost px-6 py-3">
						View work
					</a>
				</motion.div>

				{/* thin animated line */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1, delay: 0.7 }}
					className="relative mt-16 h-px w-full overflow-hidden bg-line sm:mt-24">
					<span className="absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-accent/60 to-transparent animate-line-pan" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.8 }}
					className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
					{[
						["Websites", "Fast, responsive builds"],
						["Apps", "Product flows & UI"],
						["Brands", "Digital identity systems"],
						["Launch", "Polish, testing & handover"],
					].map(([title, sub]) => (
						<div key={title}>
							<p className="text-sm font-medium text-ink">{title}</p>
							<p className="mt-1 text-sm text-haze">{sub}</p>
						</div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
