import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";

const faqs = [
	{
		question: "What does FE Studios design and build?",
		answer:
			"Custom websites, landing pages, app interfaces, UI/UX systems, digital product prototypes, and launch-ready brand systems for businesses and founders.",
	},
	{
		question: "Can FE Studios help with both design and development?",
		answer:
			"Yes. Projects can cover strategy, UX, visual design, responsive frontend build, launch support, and careful handover so the finished site or app feels coherent from first click to final detail.",
	},
	{
		question: "Who is a good fit for a project?",
		answer:
			"Businesses, founders, and small teams that need a clearer digital presence, a polished product interface, or a custom website that looks credible and drives enquiries.",
	},
	{
		question: "How do I start?",
		answer:
			"Send the idea, current website, or brief to jamie@festudios.co.uk. You will get a practical next step for the website, app, or product design work.",
	},
];

export default function FAQ() {
	return (
		<section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
			<div className="shell">
				<Reveal>
					<SectionLabel index="05">FAQ</SectionLabel>
					<h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tighter2 sm:text-[2.6rem]">
						Website design and app development questions.
					</h2>
				</Reveal>

				<div className="mt-12 divide-y divide-line border-y border-line">
					{faqs.map((faq) => (
						<article
							key={faq.question}
							className="grid gap-4 py-7 sm:grid-cols-[0.85fr_1.15fr] sm:gap-10 sm:py-9">
							<h3 className="text-lg font-semibold tracking-tightish">
								{faq.question}
							</h3>
							<p className="max-w-2xl text-[15px] leading-relaxed text-mist">
								{faq.answer}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
