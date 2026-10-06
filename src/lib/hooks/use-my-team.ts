"use client";

import { useMemo } from "react";
import { useTeamGetAll, type TeamEntity } from "@hackpsu/react-sdk";

export function memberIds(team: TeamEntity): string[] {
	return [
		team.member1,
		team.member2,
		team.member3,
		team.member4,
		team.member5,
	].filter((m): m is string => Boolean(m));
}

/*
 * apiv3 has no "my team" lookup (users carry no teamId), so this scans the
 * active hackathon's teams (GET /teams) for one containing this uid — the same
 * way frontend-template's /team page finds it.
 */
export function useMyTeam(uid?: string) {
	const { data, isLoading, isError } = useTeamGetAll();

	const team = useMemo(() => {
		if (!uid || !data) return undefined;
		// Deleted teams are soft-deleted (isActive: false) but still returned, with
		// their members intact.
		return data.find((t) => t.isActive && memberIds(t).includes(uid));
	}, [data, uid]);

	return { team, isLoading, isError };
}
