import { m } from "framer-motion";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const services = [
	{
		title: "Website Design",
		copy: "Your website is often the first impression — it should make people feel like they're in good hands immediately. I design custom sites that look sharp, communicate clearly, and turn visitors into enquiries.",
		points: ["Landing pages", "Business websites", "Responsive web design"],
	},
	{
		title: "App Development",
		copy: "Got an idea for a product? I'll take it from rough concept to a real, usable app with thoughtful user flows and an interface that feels natural from the first tap.",
		points: ["Mobile-first apps", "Product prototypes", "iOS and Android"],
	},
	{
		title: "UI/UX Design",
		copy: "UI/UX design, wireframes, prototypes, design systems, and polished interface design for products that need to be easy to understand.",
		points: ["User journeys", "Wireframes", "UX audits"],
	},
	{
		title: "Brand Systems",
		copy: "A strong visual identity does a lot of the heavy lifting for you. I'll build a digital-first brand system — typography, colour, logo, and visual rules — that keeps everything consistent and looking intentional.",
		points: ["Visual direction", "Typography", "Colour systems"],
	},
];

export default function Services() {
	return (
		<section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
			<div className="shell">
				<Reveal>
					<SectionLabel index="02">Services</SectionLabel>
					<h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tighter2 sm:text-[2.6rem]">
						What you can hire FE Studios to design and build.
					</h2>
				</Reveal>

				<div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
					{services.map((s, i) => (
						<m.div
							key={s.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-60px" }}
							transition={{
								duration: 0.6,
								delay: i * 0.06,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="group relative bg-white p-8 transition-colors duration-500 hover:bg-paper sm:p-10">
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
							<div className="mt-7 flex flex-wrap gap-2">
								{s.points.map((point) => (
									<span
										key={point}
										className="rounded-full border border-line bg-paper px-3 py-1 text-[12px] font-medium text-graphite">
										{point}
									</span>
								))}
							</div>
						</m.div>
					))}
				</div>
			</div>
		</section>
	);
}
