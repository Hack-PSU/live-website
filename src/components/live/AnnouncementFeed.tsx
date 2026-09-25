"use client";

import { DateTime } from "luxon";
import DiscordText from "./DiscordText";
import Hex from "./Hex";
import { useAnnouncements } from "@/lib/api/announcement";
import { EVENT_TZ } from "@/lib/events";
import settings from "@/lib/config/settings.json";

function postedAt(ms: number, today: DateTime): string {
	const dt = DateTime.fromMillis(ms, { zone: EVENT_TZ });
	return dt.toFormat(dt.hasSame(today, "day") ? "h:mm a" : "ccc h:mm a");
}

export default function AnnouncementFeed() {
	const { data, isLoading, isError } = useAnnouncements();
	const announcements = data ?? [];
	const today = DateTime.now().setZone(EVENT_TZ);

	const todayCount = announcements.filter((a) =>
		DateTime.fromMillis(a.timestamp, { zone: EVENT_TZ }).hasSame(today, "day")
	).length;

	return (
		<div>
			<div className="flex flex-wrap items-center gap-3.5">
				<h2 className="m-0 font-condensed text-[32px] font-bold uppercase text-foam">
					Announcements
				</h2>
				{todayCount > 0 && (
					<span className="rounded bg-gold px-2 py-1 font-mono text-[10px] font-bold tracking-[.2em] text-ink-deep">
						{todayCount} TODAY
					</span>
				)}
				<a
					href={settings.links.discord}
					target="_blank"
					rel="noopener"
					className="ml-auto font-condensed text-[15px] font-semibold uppercase tracking-[.1em] text-ember hover:text-ember-light"
				>
					Discord ↗
				</a>
			</div>

			<div className="mt-4.5 border-l-2 border-line">
				{isLoading && (
					<p className="pl-6 text-[15px] text-slate-light">Loading…</p>
				)}
				{isError && (
					<p className="pl-6 text-[15px] text-slate-light">
						Announcements aren&apos;t loading right now — check the Discord.
					</p>
				)}
				{!isLoading && !isError && announcements.length === 0 && (
					<p className="pl-6 text-[15px] text-slate-light">
						Nothing announced yet.
					</p>
				)}
				{announcements.map((a, i) => (
					<div key={a.id} className="relative pb-5.5 pl-6">
						<Hex
							size={12}
							color={i === 0 ? "#E07050" : "#7088B8"}
							className="absolute left-[-7px] top-1"
						/>
						<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
							{a.title && (
								<h3 className="m-0 text-[17px] font-bold text-foam">
									{a.title}
								</h3>
							)}
							<span className="font-mono text-[11px] text-slate">
								{postedAt(a.timestamp, today)} · {a.author}
								{a.editedTimestamp && " · edited"}
							</span>
						</div>
						{a.body && (
							<div className="mt-1.5 max-w-[62ch] text-[15px] leading-[1.55] text-slate-light [overflow-wrap:anywhere] [text-wrap:pretty]">
								<DiscordText text={a.body} />
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
