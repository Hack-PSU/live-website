"use client";

import ScheduleTimeline from "@/components/live/ScheduleTimeline";
import { useLiveSchedule } from "@/lib/hooks/use-live-schedule";

export default function SchedulePage() {
	const { events, isLoading } = useLiveSchedule();

	return (
		<main className="max-w-[1180px] px-5 pb-16 pt-8 md:px-10">
			<h1 className="m-0 font-condensed text-[52px] font-bold uppercase text-foam">
				Schedule
			</h1>
			<ScheduleTimeline events={events} isLoading={isLoading} />
		</main>
	);
}
