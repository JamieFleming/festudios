type SectionLabelProps = {
	index?: string;
	children: string;
	light?: boolean;
};

// Small uppercase editorial label with an index marker and a short rule.
export default function SectionLabel({
	index,
	children,
	light,
}: SectionLabelProps) {
	return (
		<div className="flex items-center gap-3">
			{index && (
				<span
					className={`text-[11px] font-medium tabular-nums ${
						light ? "text-white/40" : "text-accent"
					}`}>
					{index}
				</span>
			)}
			<span
				className={`h-px w-6 ${light ? "bg-white/20" : "bg-accent/20"}`}
				aria-hidden
			/>
			<span
				className={`text-[11px] font-medium uppercase tracking-label ${
					light ? "text-white/60" : "text-mist"
				}`}>
				{children}
			</span>
		</div>
	);
}
