import { AnnouncementEntity } from "./entity";

/*
 * TODO(apiv3): there is no announcements read endpoint yet. The `notification`
 * module is push-only (POST /notifications/send, /broadcast,
 * /register/device/:deviceId) and the socket gateway only emits, so nothing
 * persists a readable feed.
 *
 * Once the backend lands, this whole file becomes:
 *
 *   import { apiFetch } from "@/lib/api/apiClient";
 *   export async function getAnnouncements(): Promise<AnnouncementEntity[]> {
 *     return apiFetch<AnnouncementEntity[]>("/announcements", { method: "GET" });
 *   }
 *
 * Nothing above this layer needs to change — the hook and the UI already treat
 * this as an async query.
 */

const HOUR = 60 * 60 * 1000;

function mockAnnouncements(): AnnouncementEntity[] {
	const now = Date.now();
	return [
		{
			id: "a4",
			title: "Lunch is served",
			body: "Head to the Atrium now — one tray per person so everyone eats before the 1 PM workshop.",
			timestamp: now - 0.5 * HOUR,
			accent: "#E07050",
		},
		{
			id: "a3",
			title: "Hacking has started",
			body: "Submissions are due Sunday at 10:00 AM sharp on Devpost. Mentors are roaming in orange shirts all weekend.",
			timestamp: now - 1.5 * HOUR,
			accent: "#E2C75E",
		},
		{
			id: "a2",
			title: "Hardware lab is open",
			body: "Arduinos, sensors, and two VR headsets are available in ECoRE 118. Bring your pass to check anything out.",
			timestamp: now - 3 * HOUR,
			accent: "#64A5C3",
		},
		{
			id: "a1",
			title: "Check-in is open",
			body: "Show the QR on your pass at the Atrium desk to pick up your wristband and swag.",
			timestamp: now - 4.5 * HOUR,
			accent: "#7088B8",
		},
	];
}

export async function getAnnouncements(): Promise<AnnouncementEntity[]> {
	return mockAnnouncements();
}
