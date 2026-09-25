import { DateTime } from "luxon";
import { EventType } from "@hackpsu/react-sdk";

/** Everything in the design is quoted in the venue's timezone. */
export const EVENT_TZ = "America/New_York";

export type CategoryKey =
	"checkIn" | "workshop" | "food" | "ceremony" | "activity";

export interface Category {
	key: CategoryKey;
	label: string;
	color: string;
}

/** Category colors come straight from the design. */
export const CATEGORIES: Record<CategoryKey, Category> = {
	checkIn: { key: "checkIn", label: "Check-in", color: "#7088B8" },
	workshop: { key: "workshop", label: "Workshop", color: "#64A5C3" },
	food: { key: "food", label: "Food", color: "#E07050" },
	ceremony: { key: "ceremony", label: "Ceremony", color: "#E2C75E" },
	activity: { key: "activity", label: "Activity", color: "#B6663C" },
};

export const CATEGORY_ORDER: CategoryKey[] = [
	"checkIn",
	"workshop",
	"food",
	"ceremony",
	"activity",
];

/*
 * TODO(apiv3): the design has a fifth category, "Ceremony", but apiv3's
 * EventType enum only has activity | food | workshop | checkIn. Until a
 * `ceremony` value exists we recognize the handful of ceremony events by name.
 * This is the only place that guesses — delete it once the enum grows.
 */
const CEREMONY_PATTERNS = [
	/opening/i,
	/closing/i,
	/hacking begins/i,
	/submissions? close/i,
	/awards?/i,
];

function isCeremony(name: string): boolean {
	return CEREMONY_PATTERNS.some((re) => re.test(name));
}

export function categoryOf(event: {
	name: string;
	type: EventType | string;
}): Category {
	if (isCeremony(event.name)) return CATEGORIES.ceremony;

	switch (event.type) {
		case EventType.food:
			return CATEGORIES.food;
		case EventType.workshop:
			return CATEGORIES.workshop;
		case EventType.checkIn:
			return CATEGORIES.checkIn;
		default:
			return CATEGORIES.activity;
	}
}

/** Minimal shape the UI needs; both /events and /hackathons/active/static fit. */
export interface LiveEvent {
	id: string;
	name: string;
	type: EventType | string;
	startTime: number;
	endTime: number;
	locationName: string;
	description?: string;
}

/**
 * The fields of an event this module needs, which is a subset of the API's
 * EventEntity so both GET /events and GET /hackathons/active/static satisfy it.
 */
export interface ApiEventLike {
	id: string;
	name: string;
	type: EventType | string;
	startTime: number;
	endTime: number;
	description?: string | null;
	locationId?: number;
}

/**
 * Turns API events into the shape the UI renders.
 *
 * Location names are resolved by the caller from GET /locations rather than read
 * off the event. The static hackathon response does join the location in, but
 * the API documents `events` as plain EventEntity, which carries only
 * `locationId`, so the joined object is not part of the typed contract. Looking
 * the name up keeps this to documented fields, and matches how
 * frontend-template pairs locationId with useLocationGetAll.
 */
export function toLiveEvents(
	events: ApiEventLike[],
	resolveLocation: (locationId?: number) => string
): LiveEvent[] {
	return events
		.map((e) => ({
			id: e.id,
			name: e.name,
			type: e.type,
			startTime: e.startTime,
			endTime: e.endTime,
			locationName: resolveLocation(e.locationId),
			description: e.description ?? undefined,
		}))
		.sort((a, b) => a.startTime - b.startTime);
}

export function formatTime(ms: number): string {
	return DateTime.fromMillis(ms, { zone: EVENT_TZ }).toFormat("h:mm a");
}

export function formatRange(startMs: number, endMs: number): string {
	const start = DateTime.fromMillis(startMs, { zone: EVENT_TZ });
	const end = DateTime.fromMillis(endMs, { zone: EVENT_TZ });
	const startFmt = start.toFormat(
		start.hour < 12 === end.hour < 12 ? "h:mm" : "h:mm a"
	);
	return `${startFmt} – ${end.toFormat("h:mm a")}`;
}

export function formatClock(ms: number): string {
	return `${DateTime.fromMillis(ms, { zone: EVENT_TZ }).toFormat("h:mm a")} ET`;
}

/** "in 25 min" / "in 2h" / "now" — the design's relative ETA label. */
export function formatEta(fromMs: number, toMs: number): string {
	const mins = Math.round((toMs - fromMs) / 60_000);
	if (mins <= 0) return "now";
	if (mins < 60) return `in ${mins} min`;
	const hours = Math.round(mins / 60);
	if (hours < 24) return `in ${hours}h`;
	return `in ${Math.round(hours / 24)}d`;
}

/** "55 MIN" / "2 HR 10 MIN" — the ON NOW card's countdown. */
export function formatDuration(ms: number): string {
	const mins = Math.max(0, Math.round(ms / 60_000));
	if (mins < 60) return `${mins} MIN`;
	const hours = Math.floor(mins / 60);
	const rest = mins % 60;
	return rest ? `${hours} HR ${rest} MIN` : `${hours} HR`;
}

export function currentEvent(
	events: LiveEvent[],
	now: number
): LiveEvent | undefined {
	// Prefer the longest-running overlapping event, so "Lunch" wins over a
	// same-slot filler entry.
	return events
		.filter((e) => e.startTime <= now && e.endTime > now)
		.sort((a, b) => b.endTime - b.startTime - (a.endTime - a.startTime))[0];
}

export function upcomingEvents(
	events: LiveEvent[],
	now: number,
	count = 3
): LiveEvent[] {
	return events.filter((e) => e.startTime > now).slice(0, count);
}

export interface EventDay {
	key: string;
	/** "Saturday" */
	label: string;
	events: LiveEvent[];
}

export function groupByDay(events: LiveEvent[]): EventDay[] {
	const days = new Map<string, EventDay>();
	for (const event of events) {
		const dt = DateTime.fromMillis(event.startTime, { zone: EVENT_TZ });
		const key = dt.toFormat("yyyy-LL-dd");
		if (!days.has(key)) {
			days.set(key, { key, label: dt.toFormat("cccc"), events: [] });
		}
		days.get(key)!.events.push(event);
	}
	return Array.from(days.values()).sort((a, b) => a.key.localeCompare(b.key));
}
