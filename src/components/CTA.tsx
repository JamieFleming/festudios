import { motion } from "framer-motion";
import { logos } from "@/assets/logos";

export default function CTA() {
	return (
		<section id="contact" className="relative scroll-mt-24 px-4 pb-10 sm:px-6">
			<div className="shell !px-0">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
					className="grain relative overflow-hidden rounded-4xl bg-ink px-7 py-20 text-center sm:px-12 sm:py-28">
					{/* soft glow + grid + monogram */}
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute left-1/2 top-[-30%] h-[480px] w-[700px] max-w-[120vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(59,108,246,0.28),transparent)] blur-2xl" />
						<div
							className="absolute inset-0 opacity-[0.6]"
							style={{
								backgroundImage:
									"linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
								backgroundSize: "56px 56px",
								maskImage:
									"radial-gradient(ellipse 70% 70% at 50% 40%, black, transparent 75%)",
								WebkitMaskImage:
									"radial-gradient(ellipse 70% 70% at 50% 40%, black, transparent 75%)",
							}}
						/>
						<img
							src={logos.monogramOnDark}
							alt=""
							aria-hidden
							className="absolute -bottom-16 left-1/2 w-[60vw] max-w-[520px] -translate-x-1/2 opacity-[0.05]"
							draggable={false}
						/>
					</div>

					<div className="relative">
						<span className="text-[11px] font-medium uppercase tracking-label text-white/50">
							Start a project
						</span>
						<h2 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tighter2 text-white sm:text-6xl">
							Need a site or app that feels made for you?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
							Bring the idea, the offer, or the messy first brief. FE Studios
							will help shape it into a digital experience people understand
							and remember.
						</p>
						<a
							href="mailto:fleming1411@yahoo.co.uk"
							className="btn-light mt-10 px-7 py-3.5 text-[15px]">
							Start a project
						</a>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
