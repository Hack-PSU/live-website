export interface AnnouncementEntity {
	/** Discord message id. */
	id: string;
	/** From a leading `# Heading` or fully bold first line, when there is one. */
	title?: string;
	/** Discord-flavored markdown with pings and custom emoji stripped. */
	body: string;
	/** Server nickname, falling back to the Discord display name. */
	author: string;
	/** Epoch millis. */
	timestamp: number;
	editedTimestamp?: number;
}
