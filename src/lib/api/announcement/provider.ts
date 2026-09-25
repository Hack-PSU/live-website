import { AnnouncementEntity } from "./entity";

/*
 * TEMPORARY: reads this app's own /api/announcements route (a Discord proxy),
 * not apiv3, which is why this doesn't go through apiFetch. Once apiv3 has
 * GET /announcements this becomes:
 *
 *   return apiFetch<AnnouncementEntity[]>("/announcements", { method: "GET" });
 */
export async function getAnnouncements(): Promise<AnnouncementEntity[]> {
	const response = await fetch("/api/announcements");
	if (!response.ok) {
		throw new Error(`Request failed (${response.status})`);
	}
	return (await response.json()) as AnnouncementEntity[];
}
