/*
 * TEMPORARY: GET /api/announcements proxies the Discord announcements channel
 * until apiv3 has its own endpoint. See src/lib/discord.ts.
 */
import { NextResponse } from "next/server";
import {
	CACHE_SECONDS,
	DiscordNotConfiguredError,
	getDiscordAnnouncements,
} from "@/lib/discord";

export async function GET() {
	try {
		const announcements = await getDiscordAnnouncements();
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
