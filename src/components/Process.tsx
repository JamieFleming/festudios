import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";

const steps = [
  {
    no: "01",
    title: "Discover",
    copy: "Pin down the audience, offer, must-have features, and what the site or app needs to achieve.",
  },
  {
    no: "02",
    title: "Design",
    copy: "Map the core screens, refine the visual direction, and create an interface that feels clear from the first view.",
  },
  {
    no: "03",
    title: "Build",
    copy: "Turn the design into a fast, responsive build with careful spacing, motion, accessibility, and mobile behaviour.",
  },
  {
    no: "04",
    title: "Refine",
    copy: "Test the details, tighten the copy and interactions, then prepare everything for a confident launch.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel index="03">Process</SectionLabel>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tighter2 sm:text-[2.6rem]">
              A straightforward path from rough idea to finished product.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-mist">
              The process is built to keep decisions moving. You get structure,
              honest design thinking, and a finished site or app that feels
              considered instead of assembled in a rush.
            </p>
          </Reveal>

          <div>
            {steps.map((step, i) => (
              <Reveal key={step.no} delay={i * 0.06}>
                <div className="group grid grid-cols-[auto_1fr] gap-6 border-t border-line py-8 transition-colors duration-500 last:border-b sm:gap-10 sm:py-10">
                  <span className="text-[13px] font-medium tabular-nums text-haze transition-colors group-hover:text-accent">
                    {step.no}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tightish sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mist">
                      {step.copy}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
