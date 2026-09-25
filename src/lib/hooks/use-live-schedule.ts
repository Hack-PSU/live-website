"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { useQuery } from "@tanstack/react-query";
import {
	getActiveHackathonForStatic,
	hackathonQueryKeys,
	type StaticActiveHackathonEntity,
} from "@/lib/api/hackathon";
import type { SponsorEntity } from "@/lib/api/sponsor";
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
 * One request (`GET /hackathons/active/static`) gives the hackathon window,
 * its events, and its sponsors — everything the dashboard and schedule need.
 */
export function useLiveSchedule(): LiveSchedule {
	const { data, isLoading, isError } = useQuery<StaticActiveHackathonEntity>({
		queryKey: hackathonQueryKeys.activeStatic,
		queryFn: getActiveHackathonForStatic,
		refetchInterval: REFRESH_MS,
	});

	const events = useMemo(
		() => (data?.events ? toLiveEvents(data.events) : []),
		[data]
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
