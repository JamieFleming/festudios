import { motion } from "framer-motion";
import type { ReactNode } from "react";

export type Project = {
	name: string;
	description: string;
	category: string;
	tint: string; // tailwind gradient classes for the mock surface
	mock: ReactNode;
	url?: string;
};

export default function ProjectCard({
	project,
	index,
}: {
	project: Project;
	index: number;
}) {
	const card = (
		<motion.article
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-60px" }}
			transition={{
				duration: 0.7,
				delay: index * 0.08,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-white p-2.5 shadow-soft transition-all duration-500 ease-smooth hover:-translate-y-1 hover:shadow-lift">
			{/* Mock interface canvas */}
			<div
				className={`relative aspect-[4/3.15] overflow-hidden rounded-[22px] bg-gradient-to-br ${project.tint} shadow-soft transition-transform duration-700 ease-smooth group-hover:scale-[1.01]`}>
				<div
					className="absolute inset-0 opacity-[0.26]"
					style={{
						backgroundImage:
							"linear-gradient(to right, rgba(10,10,11,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,11,0.03) 1px, transparent 1px)",
						backgroundSize: "28px 28px",
					}}
				/>
				<div className="absolute inset-0 flex items-center justify-center p-5 transition-transform duration-700 ease-smooth group-hover:scale-[1.015] sm:p-6">
					{project.mock}
				</div>
			</div>

			<div className="flex flex-1 flex-col px-4 pb-5 pt-6">
				<span className="text-[11px] font-medium uppercase tracking-label text-mist">
					{project.category}
				</span>
				<h3 className="mt-3 text-xl font-semibold tracking-tightish">
					{project.name}
				</h3>
				<p className="mt-2 text-[15px] leading-relaxed text-mist">
					{project.description}
				</p>
				<div className="mt-5 flex items-center gap-2 text-sm font-medium text-ink">
					<span className="transition-colors group-hover:text-accent">
						{project.url ? "Visit site" : "View case"}
					</span>
					<span className="transition-transform duration-300 ease-smooth group-hover:translate-x-1">
						&rarr;
					</span>
				</div>
			</div>
		</motion.article>
	);

	if (project.url) {
		return (
			<a
				href={project.url}
				target="_blank"
				rel="noreferrer"
				className="no-underline">
				{card}
			</a>
		);
	}

	return card;
}
