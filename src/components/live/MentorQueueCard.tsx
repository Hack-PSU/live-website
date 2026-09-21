import settings from "@/lib/config/settings.json";

/*
 * TODO: QStack (Hack-PSU/qstack) has no public read endpoint for queue depth,
 * so the copy here is static. Swap in live counts once one exists.
 */
export default function MentorQueueCard() {
	return (
		<div className="rounded-2xl border border-line bg-surface p-5">
			<h3 className="m-0 mb-2.5 font-condensed text-[22px] font-bold uppercase text-foam">
				Mentor queue
			</h3>
			<p className="m-0 text-[15px] leading-[1.5] text-slate-light">
				Stuck on something? Post to the queue and a mentor will come find you.
			</p>
			<a
				href={settings.links.qstack}
				target="_blank"
				rel="noopener"
				className="mt-4 block rounded-[10px] bg-slate p-3 text-center font-condensed text-base font-semibold uppercase tracking-[.1em] text-ink-deep hover:bg-[#8EA3C9]"
			>
				Open QStack ↗
			</a>
		</div>
	);
}
