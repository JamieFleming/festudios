import ProjectCard, { type Project } from "./ProjectCard";
import SectionLabel from "./SectionLabel";
import Reveal from "./Reveal";
import munchsproutsDash from "../../assets/images/munchsprouts_dash.png";
import crewmateDash from "../../assets/images/crewmate_dash.png";
import sussdImage from "../../assets/images/sussd_image.png";

// Screenshot-based preview windows for the projects.
function MunchMock() {
	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="relative w-[112%] overflow-hidden rounded-[22px] border border-white/70 bg-white shadow-lift ring-1 ring-ink/[0.04]">
				<div className="flex h-7 items-center justify-between border-b border-line bg-white/85 px-3 backdrop-blur">
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-rose-300" />
						<span className="h-2 w-2 rounded-full bg-amber-300" />
						<span className="h-2 w-2 rounded-full bg-emerald-300" />
					</div>
					<span className="h-1.5 w-16 rounded-full bg-ink/10" />
				</div>
				<div className="relative aspect-[3392/1971] overflow-hidden">
					<img
						src={munchsproutsDash}
						alt="MunchSprouts product page screenshot"
						className="h-full w-full object-cover object-top"
					/>
				</div>
			</div>
			<div className="pointer-events-none absolute inset-x-6 bottom-2 h-16 rounded-full bg-emerald-300/20 blur-2xl" />
		</div>
	);
}

function CrewMock() {
	return (
		<div className="relative flex h-full w-full items-center justify-center">
			<div className="relative h-[97%] max-h-[334px] aspect-[7/9.8] rounded-[24px] bg-ink p-1.5 shadow-lift ring-1 ring-white/50">
				<div className="absolute left-1/2 top-1.5 z-10 h-1 w-14 -translate-x-1/2 rounded-full bg-white/15" />
				<div className="relative h-full overflow-hidden rounded-[19px] bg-white">
					<img
						src={crewmateDash}
						alt="CrewMate tablet dashboard screenshot"
						className="h-full w-full object-cover object-top"
					/>
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent" />
				</div>
			</div>
			<div className="pointer-events-none absolute -right-2 bottom-5 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />
			<div className="pointer-events-none absolute left-4 top-8 h-16 w-16 rounded-full bg-sky-300/20 blur-xl" />
		</div>
	);
}

function SussMock() {
	return (
		<div className="relative h-full w-full overflow-hidden rounded-[26px] border border-white/10 bg-[#07030c] shadow-lift">
			<img
				src={sussdImage}
				alt="Suss'd game screen"
				className="absolute inset-0 h-full w-full object-cover object-[50%_38%] opacity-95"
			/>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/35" />
			<div className="absolute bottom-3 left-3 rounded-full border border-red-400/35 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-label text-red-100 backdrop-blur">
				Game UI
			</div>
			<div className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_22px_rgba(239,68,68,0.9)]" />
		</div>
	);
}

const projects: Project[] = [
	{
		name: "MunchSprouts",
		description:
			"A family-focused app and landing page for baby-led weaning, combining a friendly brand, clear downloads, recipe discovery, and a polished mobile product preview.",
		category: "App Landing Page · Mobile UI",
		tint: "from-emerald-50 via-emerald-100 to-white",
		mock: <MunchMock />,
		url: "https://www.munchsprouts.co.uk",
	},
	{
		name: "CrewMate",
		description:
			"A practical ePCR and on-scene workflow tool for crews, designed around fast access to patient forms, scoring tools, observations, and clinical reference tasks.",
		category: "Healthcare App · Workflow UI",
		tint: "from-sky-50 via-cyan-50 to-white",
		mock: <CrewMock />,
		url: "https://jamiefleming.github.io/ePCR-App/",
	},
	{
		name: "Suss'd",
		description:
			"A social deception game concept with a bold visual identity, moody interface direction, and a mobile menu system built to feel immediate and replayable.",
		category: "Game UI · Mobile Experience",
		tint: "from-zinc-950 via-purple-950 to-rose-950",
		mock: <SussMock />,
	},
];

export default function Work() {
	return (
		<section id="work" className="relative scroll-mt-24 py-24 sm:py-32">
			<div className="shell">
				<Reveal>
					<div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
						<div>
							<SectionLabel index="01">Selected work</SectionLabel>
							<h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tighter2 sm:text-[2.6rem]">
								Recent work across websites, apps, and product interfaces.
							</h2>
						</div>
						<p className="max-w-xs text-[15px] leading-relaxed text-mist">
							Each project is shaped around a real use case, from first
							impression to the details people tap, read, and rely on.
						</p>
					</div>
				</Reveal>

				<div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((p, i) => (
						<ProjectCard key={p.name} project={p} index={i} />
					))}
				</div>
			</div>
		</section>
	);
}
