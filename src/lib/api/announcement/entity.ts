export interface AnnouncementEntity {
	id: string;
	title: string;
	body: string;
	/** Epoch millis. */
	timestamp: number;
	/** Hex accent for the timeline hexagon. */
	accent: string;
}
