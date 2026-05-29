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
					className="grain relative overflow-hidden rounded-3xl bg-ink px-7 py-16 sm:px-12 sm:py-20">
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute inset-x-0 top-0 h-px bg-white/20" />
						<div
							className="absolute inset-0 opacity-[0.36]"
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
							className="absolute -bottom-12 right-[-4%] w-[48vw] max-w-[430px] opacity-[0.05]"
							draggable={false}
						/>
					</div>

					<div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
						<div>
							<span className="text-[11px] font-medium uppercase tracking-label text-white/50">
								Start a project
							</span>
							<h2 className="mt-6 max-w-2xl text-balance text-4xl font-semibold leading-[1.05] tracking-tighter2 text-white sm:text-6xl">
								Ready for a website or app people take seriously?
							</h2>
							<p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
								Send over the idea, the current site, or the brief. You will get
								a practical next step, not a vague sales call.
							</p>
						</div>
						<div className="flex flex-col items-start gap-5 lg:items-end">
							<div className="grid gap-2 text-sm text-white/60">
								<span>Website design</span>
								<span>App UI and product builds</span>
								<span>Brand direction for launch</span>
							</div>
							<a
								href="mailto:jamie@festudios.co.uk"
								className="btn-light px-7 py-3.5 text-[15px]">
								Get a project quote
							</a>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
