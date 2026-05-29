import { motion } from "framer-motion";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const services = [
	{
		title: "Website Design",
		copy: "Custom landing pages, business sites, and portfolios that make the offer clear, look current, and guide visitors toward action.",
	},
	{
		title: "App Development",
		copy: "App concepts and responsive builds with proper user flows, tidy interface systems, and screens that feel ready to use.",
	},
	{
		title: "UI/UX Design",
		copy: "Wireframes, prototypes, design systems, and polished interface design for products that need to be easy to understand.",
	},
	{
		title: "Brand Systems",
		copy: "Digital-first identity work: typography, colour, logo usage, and visual rules that keep your product consistent everywhere.",
	},
];

export default function Services() {
	return (
		<section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
			<div className="shell">
				<Reveal>
					<SectionLabel index="02">Services</SectionLabel>
					<h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tighter2 sm:text-[2.6rem]">
						Design and development for businesses that need to look credible online.
					</h2>
				</Reveal>

				<div className="mt-14 grid gap-px overflow-hidden rounded-4xl border border-line bg-line sm:grid-cols-2">
					{services.map((s, i) => (
						<motion.div
							key={s.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{
								duration: 0.6,
								delay: i * 0.06,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="group relative bg-white p-8 transition-colors duration-500 hover:bg-accent/5 sm:p-10">
							<div className="flex items-start justify-between">
								<span className="text-[13px] font-medium tabular-nums text-haze transition-colors duration-300 group-hover:text-accent">
									0{i + 1}
								</span>
								<span className="text-haze transition-all duration-300 ease-smooth group-hover:translate-x-1 group-hover:text-ink">
									&rarr;
								</span>
							</div>
							<h3 className="mt-10 text-xl font-semibold tracking-tightish sm:text-2xl">
								{s.title}
							</h3>
							<p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
								{s.copy}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
