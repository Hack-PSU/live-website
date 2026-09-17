"use client";

import { DateTime } from "luxon";
import Hex from "./Hex";
import { useAnnouncements } from "@/lib/api/announcement";
import { EVENT_TZ } from "@/lib/events";

export default function AnnouncementFeed() {
	const { data, isLoading } = useAnnouncements();
	const announcements = data ?? [];

	const todayCount = announcements.filter((a) =>
		DateTime.fromMillis(a.timestamp, { zone: EVENT_TZ }).hasSame(
			DateTime.now().setZone(EVENT_TZ),
			"day"
		)
	).length;

	return (
		<div>
			<div className="flex items-center gap-3.5">
				<h2 className="m-0 font-condensed text-[32px] font-bold uppercase text-foam">
					Announcements
				</h2>
				{todayCount > 0 && (
					<span className="rounded bg-gold px-2 py-1 font-mono text-[10px] font-bold tracking-[.2em] text-ink-deep">
						{todayCount} TODAY
					</span>
				)}
			</div>

			<div className="mt-4.5 border-l-2 border-line">
				{isLoading && (
					<p className="pl-6 text-[15px] text-slate-light">Loading…</p>
				)}
				{!isLoading && announcements.length === 0 && (
					<p className="pl-6 text-[15px] text-slate-light">
						Nothing announced yet.
					</p>
				)}
				{announcements.map((a) => (
					<div key={a.id} className="relative pb-5.5 pl-6">
						<Hex
							size={12}
							color={a.accent}
							className="absolute left-[-7px] top-1"
						/>
						<div className="flex flex-wrap items-baseline gap-3">
							<h3 className="m-0 text-[17px] font-bold text-foam">{a.title}</h3>
							<span className="font-mono text-[11px] text-slate">
								{DateTime.fromMillis(a.timestamp, { zone: EVENT_TZ }).toFormat(
									"h:mm a"
								)}
							</span>
						</div>
						<p className="m-0 mt-1.5 max-w-[62ch] text-[15px] leading-[1.55] text-slate-light [text-wrap:pretty]">
							{a.body}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
