"use client";

import { useCallback, useMemo } from "react";
import { DateTime } from "luxon";
import {
	useHackathonGetForStatic,
	useLocationGetAll,
	type SponsorEntity,
} from "@hackpsu/react-sdk";
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
	/** Sorted by `order`, as organizers arrange them in admin. */
	sponsors: SponsorEntity[];
	isLoading: boolean;
	isError: boolean;
	/** True while we're still showing settings.json rather than API data. */
	isFallback: boolean;
}

/** Organizers move events around during the weekend; pick that up without a reload. */
const REFRESH_MS = 60_000;

/**
 * `GET /hackathons/active/static` gives the hackathon window, its events and its
 * sponsors. Room names come from `GET /locations`, which the events reference by
 * id; both are public, and locations change rarely enough to outlive the
 * schedule poll.
 */
export function useLiveSchedule(): LiveSchedule {
	const { data, isLoading, isError } = useHackathonGetForStatic({
		query: { refetchInterval: REFRESH_MS },
	});

	const { data: locations } = useLocationGetAll();

	const locationNames = useMemo(
		() => new Map((locations ?? []).map((l) => [l.id, l.name])),
		[locations]
	);

	const resolveLocation = useCallback(
		(locationId?: number) =>
			(locationId === undefined ? undefined : locationNames.get(locationId)) ??
			"TBA",
		[locationNames]
	);

	const events = useMemo(
		() => (data?.events ? toLiveEvents(data.events, resolveLocation) : []),
		[data, resolveLocation]
	);

	const sponsors = useMemo(
		() => [...(data?.sponsors ?? [])].sort((a, b) => a.order - b.order),
		[data]
	);

	return {
		name: data?.name ?? FALLBACK.name,
		startTime: data?.startTime ?? FALLBACK.startTime,
		endTime: data?.endTime ?? FALLBACK.endTime,
		events,
		sponsors,
		isLoading,
		isError,
		isFallback: !data,
	};
}
