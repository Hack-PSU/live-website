"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon";
import { toLiveEvents, type LiveEvent } from "@/lib/events";
import settings from "@/lib/config/settings.json";

/** Used until GET /hackathons/active/static resolves, so the first paint is sane. */
const FALLBACK = {
	name: settings.hackathonName,
	startTime: DateTime.fromISO(settings.hackathonDate).toMillis(),
	endTime: DateTime.fromISO(settings.hackathonEndDate).toMillis(),
};

export interface LiveSchedule {
	name: string;
	startTime: number;
	endTime: number;
	events: LiveEvent[];
	isLoading: boolean;
	isError: boolean;
	/** True while we're still showing settings.json rather than API data. */
	isFallback: boolean;
}

/**
 * One request (`GET /hackathons/active/static`) gives the hackathon window,
 * its events, and its sponsors — everything the dashboard and schedule need.
 */
export function useLiveSchedule(): LiveSchedule {
	const { data, isLoading, isError } = useActiveHackathonForStatic();

	const events = useMemo(
		() => (data?.events ? toLiveEvents(data.events) : []),
		[data]
	);

	return {
		name: data?.name ?? FALLBACK.name,
		startTime: data?.startTime ?? FALLBACK.startTime,
		endTime: data?.endTime ?? FALLBACK.endTime,
		events,
		isLoading,
		isError,
		isFallback: !data,
	};
}
