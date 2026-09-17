import Hex from "./Hex";
import {
	categoryOf,
	formatDuration,
	formatRange,
	type LiveEvent,
} from "@/lib/events";

interface Props {
	event?: LiveEvent;
	now: number | null;
}

export default function OnNowCard({ event, now }: Props) {
	if (!event) {
		return (
			<article className="flex flex-col rounded-[18px] border border-line bg-surface p-6">
				<div className="flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[.24em] text-slate">
					<Hex size={8} />
					NOTHING SCHEDULED
				</div>
				<h1 className="my-3.5 font-condensed text-[clamp(34px,4.4vw,54px)] font-bold uppercase leading-[.98] text-foam">
					Keep hacking
				</h1>
				<p className="m-0 max-w-[46ch] text-[15px] leading-relaxed text-slate-light">
					No session is running right now. Check the schedule for what&apos;s
					coming up next.
				</p>
			</article>
		);
	}

	const category = categoryOf(event);

	return (
		<article className="flex flex-col rounded-[18px] bg-ember p-6 px-6.5 text-ink-deep">
			<div className="flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[.24em]">
				<Hex size={8} color="#081826" blink />
				ON NOW · {category.label}
			</div>
			<h1 className="mb-2.5 mt-3.5 font-condensed text-[clamp(34px,4.4vw,54px)] font-bold uppercase leading-[.98]">
				{event.name}
			</h1>
			<p className="m-0 text-[17px] font-bold">
				{formatRange(event.startTime, event.endTime)} · {event.locationName}
			</p>
			{event.description && (
				<p className="m-0 mt-2.5 max-w-[46ch] text-[15px] leading-[1.5] text-ink-deep/80 [text-wrap:pretty]">
					{event.description}
				</p>
			)}
			<div className="mt-auto pt-[18px] font-mono text-xs font-bold tracking-[.14em]">
				{now === null
					? "ENDS SOON"
					: `ENDS IN ${formatDuration(event.endTime - now)}`}
			</div>
		</article>
	);
}
