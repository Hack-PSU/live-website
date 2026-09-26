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
 * TODO(apiv3): there is no "my team" lookup — GET /teams/:id needs a team id,
 * and UserEntity carries no teamId. Until a GET /teams/mine (or a teamId on the
 * user) exists, we scan the active hackathon's teams (GET /teams, which is
 * public) for one containing this uid.
 */
export function useMyTeam(uid?: string) {
	const { data, isLoading, isError } = useTeamGetAll();

	const team = useMemo(() => {
		if (!uid || !data) return undefined;
		return data.find((t) => memberIds(t).includes(uid));
	}, [data, uid]);

	return { team, isLoading, isError };
}
