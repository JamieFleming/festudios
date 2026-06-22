import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import { logos } from "@/assets/logos";

export default function About() {
	return (
		<section id="about" className="relative scroll-mt-24 py-24 sm:py-32">
			<div className="shell">
				<Reveal>
					<div className="relative overflow-hidden rounded-4xl border border-line bg-white px-7 py-14 shadow-soft sm:px-14 sm:py-20">
						<img
							src={logos.monogramOnLight}
							alt=""
							aria-hidden
							width={480}
							height={480}
							loading="lazy"
							decoding="async"
							className="pointer-events-none absolute -right-10 -top-10 w-64 opacity-[0.04] sm:w-96"
							draggable={false}
						/>
						<div className="relative max-w-2xl">
							<SectionLabel index="04">About</SectionLabel>
							<h2 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tighter2 sm:text-[2.8rem]">
								Small studio attention. Product-level finish.
							</h2>
							<p className="mt-6 text-[17px] leading-relaxed text-graphite">
								I started FE Studios because I believe small teams and
								independent businesses deserve the same quality of design and
								build that bigger companies take for granted. I work with UK
								founders and businesses who want a website or digital product
								that actually reflects how good they are — not something cobbled
								together from a template and forgotten about. My focus is
								straightforward: strong visual direction, user experience that
								makes sense, and clean, solid code. I care about the details
								because the details are what people notice.
							</p>
							<div className="mt-8 h-px w-full bg-line" />
							<p className="mt-8 max-w-xl text-[15px] leading-relaxed text-mist">
								Direct collaboration, clear decisions, and careful handover from
								the first sketch to the final launch.
							</p>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
