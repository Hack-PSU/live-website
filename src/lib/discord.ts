/*
 * Server-only. Reads the HackPSU Discord announcements channel with a bot
 * token and turns messages into AnnouncementEntity rows.
 *
 * TEMPORARY: this lives here until apiv3 grows GET /announcements. When it
 * does, move this file there, point src/lib/api/announcement/provider.ts at
 * apiFetch("/announcements"), and delete src/app/api/announcements.
 */
import { DateTime } from "luxon";
import type { AnnouncementEntity } from "@/lib/api/announcement/entity";
import { EVENT_TZ } from "@/lib/events";

const DISCORD_API = "https://discord.com/api/v10";

/** How long a Discord response is reused before we ask again. */
export const CACHE_SECONDS = 30;

const MESSAGE_LIMIT = 20;

/** Message types that are actual posts: DEFAULT and REPLY. */
const POST_TYPES = new Set([0, 19]);

interface DiscordUser {
	id: string;
	username: string;
	global_name?: string | null;
}

interface DiscordEmbed {
	title?: string;
	description?: string;
}

interface DiscordMessage {
	id: string;
	type: number;
	content: string;
	timestamp: string;
	edited_timestamp: string | null;
	author: DiscordUser;
	member?: { nick?: string | null };
	mentions: DiscordUser[];
	embeds: DiscordEmbed[];
}

export class DiscordNotConfiguredError extends Error {
	constructor() {
		super("DISCORD_BOT_TOKEN and DISCORD_ANNOUNCEMENTS_CHANNEL_ID must be set");
	}
}

export class DiscordRequestError extends Error {
	constructor(
		readonly status: number,
		body: string
	) {
		super(`Discord responded ${status}: ${body}`);
	}
}

const displayName = (user: DiscordUser) => user.global_name || user.username;

const TIMESTAMP_FORMATS: Record<string, string> = {
	t: "h:mm a",
	T: "h:mm:ss a",
	d: "L/d/yyyy",
	D: "LLLL d, yyyy",
	f: "LLLL d, yyyy h:mm a",
	F: "cccc, LLLL d, yyyy h:mm a",
	// Relative ("in 2 hours") would go stale in the cache, so show it absolute.
	R: "ccc h:mm a",
};

/**
 * Rewrites Discord-only syntax into plain markdown: pings are dropped, user
 * mentions become names, custom emoji are removed, and <t:…> timestamps are
 * rendered in the venue's timezone.
 */
function cleanContent(content: string, mentions: DiscordUser[]): string {
	const names = new Map(mentions.map((u) => [u.id, displayName(u)]));

	return content
		.replace(/@(everyone|here)\b/g, "")
		.replace(/<@&\d+>/g, "")
		.replace(/<@!?(\d+)>/g, (_, id: string) => `@${names.get(id) ?? "user"}`)
		.replace(/<#\d+>/g, "#channel")
		.replace(/<a?:\w+:\d+>/g, "")
		.replace(/<t:(\d+)(?::([tTdDfFR]))?>/g, (_, secs: string, style = "f") =>
			DateTime.fromSeconds(Number(secs), { zone: EVENT_TZ }).toFormat(
				TIMESTAMP_FORMATS[style]
			)
		)
		.replace(/[ \t]+$/gm, "")
		.trim();
}

/** A leading `# Heading` or fully bold first line becomes the title. */
function splitTitle(text: string): { title?: string; body: string } {
	const [first, ...rest] = text.split("\n");
	const match =
		first.match(/^#{1,3}\s+(.+)$/) ?? first.match(/^\*\*([^*]+)\*\*$/);
	if (!match) return { body: text };
	return { title: match[1].trim(), body: rest.join("\n").trim() };
}

function toAnnouncement(message: DiscordMessage): AnnouncementEntity | null {
	if (!POST_TYPES.has(message.type)) return null;

	// Crossposts from followed channels can arrive as an embed with no content.
	const embed = message.embeds[0];
	const raw =
		message.content ||
		[embed?.title && `**${embed.title}**`, embed?.description]
			.filter(Boolean)
			.join("\n");

	const text = cleanContent(raw, message.mentions);
	if (!text) return null;

	return {
		id: message.id,
		...splitTitle(text),
		author: message.member?.nick || displayName(message.author),
		timestamp: Date.parse(message.timestamp),
		editedTimestamp: message.edited_timestamp
			? Date.parse(message.edited_timestamp)
			: undefined,
	};
}

export async function getDiscordAnnouncements(): Promise<AnnouncementEntity[]> {
	const token = process.env.DISCORD_BOT_TOKEN;
	const channelId = process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID;
	if (!token || !channelId) throw new DiscordNotConfiguredError();

	const response = await fetch(
		`${DISCORD_API}/channels/${channelId}/messages?limit=${MESSAGE_LIMIT}`,
		{
			headers: { Authorization: `Bot ${token}` },
			next: { revalidate: CACHE_SECONDS },
		}
	);

	if (!response.ok) {
		throw new DiscordRequestError(response.status, await response.text());
	}

	const messages = (await response.json()) as DiscordMessage[];
	return messages
		.map(toAnnouncement)
		.filter((a): a is AnnouncementEntity => a !== null);
}
