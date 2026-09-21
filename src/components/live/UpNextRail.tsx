import Link from "next/link";
import Hex from "./Hex";
import {
	categoryOf,
	formatEta,
	formatTime,
	type LiveEvent,
} from "@/lib/events";

interface Props {
	events: LiveEvent[];
	now: number | null;
}

export default function UpNextRail({ events, now }: Props) {
	return (
		<div className="rounded-[18px] border border-line bg-surface p-5">
			<div className="flex items-center justify-between gap-2.5">
				<span className="font-condensed text-[19px] font-semibold uppercase tracking-[.14em] text-slate">
					Up next
				</span>
				<Link
					href="/schedule"
					className="font-condensed text-[15px] font-semibold uppercase tracking-[.1em] text-ember hover:text-ember-light"
				>
					All →
				</Link>
			</div>

			<div className="mt-3.5 flex flex-col gap-2.5">
				{events.length === 0 && (
					<p className="m-0 text-sm text-slate-light">
						Nothing else on the schedule.
					</p>
				)}
				{events.map((event) => (
					<article
						key={event.id}
						className="rounded-xl border border-line bg-ink-deep px-4 py-3.5"
					>
						<div className="flex flex-wrap items-center gap-2.5 font-mono text-xs font-medium text-slate">
							<Hex size={10} color={categoryOf(event).color} />
							<span>{formatTime(event.startTime)}</span>
							<span className="ml-auto uppercase tracking-[.1em] text-ember">
								{now === null ? "" : formatEta(now, event.startTime)}
							</span>
						</div>
						<div className="mt-[7px] font-condensed text-[22px] font-semibold uppercase leading-[1.12] text-foam">
							{event.name}
						</div>
						<div className="mt-0.5 text-[13px] text-slate-light">
							{event.locationName}
						</div>
					</article>
				))}
			</div>
		</div>
	);
}
