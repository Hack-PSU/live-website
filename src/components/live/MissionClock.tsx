"use client";

import { DateTime } from "luxon";
import Hex from "./Hex";
import { useEventPhase } from "@/lib/hooks/use-event-phase";
import { EVENT_TZ } from "@/lib/events";

interface Props {
	startTime: number;
	endTime: number;
	now: number | null;
}

function Counter({
	value,
	label,
	accent,
}: {
	value: string;
	label: string;
	accent?: boolean;
}) {
	return (
		<div className="rounded-b-xl border-t-2 border-ember bg-ink-deep/55 px-2.5 py-3.5 text-center">
			<div
				className={`font-mono text-[clamp(28px,4.2vw,50px)] font-bold leading-none ${
					accent ? "text-ember" : "text-foam"
				}`}
			>
				{value}
			</div>
			<div className="mt-2 font-condensed text-[13px] font-semibold uppercase tracking-[.2em] text-slate">
				{label}
			</div>
		</div>
	);
}

export default function MissionClock({ startTime, endTime, now }: Props) {
	const phase = useEventPhase(startTime, endTime, now);
	const fmt = (ms: number) =>
		DateTime.fromMillis(ms, { zone: EVENT_TZ }).toFormat("ccc h a");
	const mid = startTime + (endTime - startTime) / 2;

	return (
		<section className="relative mt-4 overflow-hidden rounded-[18px] border border-line bg-[linear-gradient(115deg,#10384F_0%,#0D2B3E_52%,#0A1E2E_100%)] px-6.5 py-5.5">
			<div className="hp-hatch pointer-events-none absolute inset-0" />

			<div className="relative flex items-center gap-3">
				<Hex size={8} color="#E07050" blink />
				<span className="font-mono text-[11px] font-bold tracking-[.24em] text-ember">
					{phase.label}
				</span>
				<span className="ml-auto text-sm text-slate-light">
					{phase.sublabel}
				</span>
			</div>

			<div className="relative mt-4.5 grid grid-cols-4 gap-3">
				<Counter value={phase.days} label="Days" />
				<Counter value={phase.hours} label="Hours" />
				<Counter value={phase.minutes} label="Minutes" />
				<Counter value={phase.seconds} label="Seconds" accent />
			</div>

			<div className="relative mt-5.5">
				<div className="h-2 overflow-hidden rounded-full bg-slate/20">
					<div
						className="h-full bg-[linear-gradient(90deg,#7088B8,#E07050)] transition-[width] duration-1000 ease-linear"
						style={{ width: `${phase.progress.toFixed(1)}%` }}
					/>
				</div>
				<div className="mt-2 flex justify-between text-xs uppercase tracking-[.06em] text-slate">
					<span>{fmt(startTime)} · start</span>
					<span>{fmt(mid)}</span>
					<span>{fmt(endTime)} · submit</span>
				</div>
			</div>
		</section>
	);
}
