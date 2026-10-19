import settings from "@/lib/config/settings.json";

export default function StillStuck() {
	return (
		<div className="rounded-2xl border border-line bg-surface p-5">
			<div className="font-mono text-[10px] font-bold tracking-[.22em] text-slate">
				STILL STUCK?
			</div>
			<h2 className="mb-1.5 mt-2.5 font-condensed text-[30px] font-bold uppercase text-foam">
				Ask an organizer
			</h2>
			<p className="m-0 text-sm text-slate-light">
				Find someone in an orange shirt at the Atrium desk, or message us on
				Discord.
			</p>
			<a
				href={settings.links.discord}
				target="_blank"
				rel="noopener"
				className="mt-4 inline-block rounded-lg bg-ember px-5 py-2.5 font-condensed text-base font-semibold uppercase tracking-[.1em] text-ink-deep hover:bg-ember-light"
			>
				Discord ↗&#xFE0E;
			</a>
		</div>
	);
}