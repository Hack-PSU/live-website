/*
 * TEMPORARY: GET /api/announcements proxies the Discord announcements channel
 * until apiv3 has its own endpoint. See src/lib/discord.ts.
 */
import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import {
	CACHE_SECONDS,
	DiscordNotConfiguredError,
	getDiscordAnnouncements,
} from "@/lib/discord";
import { EVENT_TZ } from "@/lib/events";
import settings from "@/lib/config/settings.json";

/** The active hackathon only changes between semesters. */
const HACKATHON_CACHE_SECONDS = 300;

/** Start time of the active hackathon, or settings.json if apiv3 is down. */
async function activeHackathonStart(): Promise<number> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL_V3}/hackathons/active`,
			{ next: { revalidate: HACKATHON_CACHE_SECONDS } }
		);
		if (response.ok) {
			const { startTime } = (await response.json()) as { startTime: number };
			return startTime;
		}
	} catch (error) {
		console.error("[announcements] active hackathon lookup failed", error);
	}
	return Date.parse(settings.hackathonDate);
}

/**
 * Posts before the start of the active hackathon's semester belong to past
 * hackathons. Spring semesters start Jan 1 and fall semesters Jul 1, so
 * pre-event announcements (info sessions, registration) still show.
 */
function semesterStart(ms: number): number {
	const dt = DateTime.fromMillis(ms, { zone: EVENT_TZ });
	return dt
		.set({ month: dt.month >= 7 ? 7 : 1 })
		.startOf("month")
		.toMillis();
}

export async function GET() {
	try {
		const [all, hackathonStart] = await Promise.all([
			getDiscordAnnouncements(),
			activeHackathonStart(),
		]);
		const since = semesterStart(hackathonStart);
		const announcements = all.filter((a) => a.timestamp >= since);
		return NextResponse.json(announcements, {
			headers: {
				"Cache-Control": `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
			},
		});
	} catch (error) {
		console.error("[announcements]", error);
		const status = error instanceof DiscordNotConfiguredError ? 503 : 502;
		return NextResponse.json(
			{ error: "Announcements are unavailable right now." },
			{ status }
		);
	}
}
