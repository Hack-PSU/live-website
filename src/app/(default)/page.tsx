"use client";

import AnnouncementFeed from "@/components/live/AnnouncementFeed";
import MissionClock from "@/components/live/MissionClock";
import OnNowCard from "@/components/live/OnNowCard";
import QuickLinks from "@/components/live/QuickLinks";
import SponsorWall from "@/components/live/SponsorWall";
import TeamCard from "@/components/live/TeamCard";
import UpNextRail from "@/components/live/UpNextRail";
import { currentEvent, upcomingEvents } from "@/lib/events";
import { useLiveClock } from "@/lib/hooks/use-live-clock";
import { useLiveSchedule } from "@/lib/hooks/use-live-schedule";

export default function DashboardPage() {
	const now = useLiveClock();
	const { events, sponsors, startTime, endTime, isLoading } = useLiveSchedule();

	const reference = now ?? startTime;
	const onNow = currentEvent(events, reference);
	const upNext = upcomingEvents(events, reference, 3);

	return (
		<main className="max-w-[1180px] px-5 pb-16 pt-8 md:px-10">
			<section className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
				<OnNowCard event={onNow} now={now} />
				<UpNextRail events={upNext} now={now} />
			</section>

			<MissionClock startTime={startTime} endTime={endTime} now={now} />

			<section className="mt-7.5 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
				<AnnouncementFeed />
				<div className="flex flex-col gap-3.5">
					<TeamCard />
					<QuickLinks />
				</div>
			</section>

			<section className="mt-10">
				<SponsorWall sponsors={sponsors} isLoading={isLoading} />
			</section>
		</main>
	);
}
