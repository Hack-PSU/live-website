export enum EventType {
	activity = "activity",
	food = "food",
	workshop = "workshop",
	checkIn = "checkIn",
}

export interface EventEntity {
	id: string;
	name: string;
	type: EventType;
	description?: string;
	locationId?: number;
	icon?: string;
	startTime: number;
	endTime: number;
	wsPresenterNames?: string;
	wsRelevantSkills?: string;
	wsSkillLevel?: string;
	wsUrls?: string[];
	hackathonId?: string;
	/** Fast-pass holders skip the line for this event. */
	fastPass: boolean;
}

export interface EventEntityResponse extends EventEntity {
	wsUrls: string[];
	location: {
		id: number;
		name: string;
	};
}

export interface CreateScanEntity {
	timestamp: number;
}
