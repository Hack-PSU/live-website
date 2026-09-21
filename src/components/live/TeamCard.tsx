"use client";

import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useMyTeam, memberIds } from "@/lib/hooks/use-my-team";
import settings from "@/lib/config/settings.json";

export default function TeamCard() {
	const { isAuthenticated, user } = useFirebase();
	const { team, isLoading, isError } = useMyTeam(user?.uid);

	return (
		<div className="rounded-2xl border border-line bg-surface p-5">
			<h3 className="m-0 mb-3.5 font-condensed text-[22px] font-bold uppercase text-foam">
				Your team
			</h3>

			{!isAuthenticated ? (
				<p className="m-0 text-sm text-slate-light">
					Sign in from My pass to see your team.
				</p>
			) : isLoading ? (
				<p className="m-0 text-sm text-slate-light">Loading…</p>
			) : team ? (
				<div className="flex items-center gap-3.5">
					<div className="font-mono text-[30px] font-bold text-ember">
						{memberIds(team).length}
					</div>
					<div className="text-sm text-slate-light">
						members in {team.name}
						<br />
						Devpost: not submitted
					</div>
				</div>
			) : (
				<p className="m-0 text-sm text-slate-light">
					{isError
						? "Couldn't load your team right now."
						: "You're not on a team yet — grab teammates and register one."}
				</p>
			)}

			<a
				href={settings.links.devpost}
				target="_blank"
				rel="noopener"
				className="mt-4 block rounded-[10px] border border-ember/55 p-3 text-center font-condensed text-base font-semibold uppercase tracking-[.1em] text-ember hover:bg-ember/[.14]"
			>
				Submit project
			</a>
		</div>
	);
}
