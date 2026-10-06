"use client";

import { useFirebase, useProjectGetProjectsByTeam } from "@hackpsu/react-sdk";
import { useMyTeam, memberIds } from "@/lib/hooks/use-my-team";
import settings from "@/lib/config/settings.json";

export default function TeamCard() {
	const { isAuthenticated, user } = useFirebase();
	const { team, isLoading, isError } = useMyTeam(user?.uid);
	const { data: projects } = useProjectGetProjectsByTeam(team?.id ?? "", {
		query: { enabled: Boolean(team?.id) },
	});
	const project = projects?.[0];

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
						{project?.devpostLink ? (
							<a
								href={project.devpostLink}
								target="_blank"
								rel="noopener"
								className="text-foam hover:text-ember"
							>
								Submitted: {project.name} ↗
							</a>
						) : project ? (
							<>Project: {project.name}</>
						) : (
							"Devpost: not submitted"
						)}
						<br />
						<a
							href={settings.links.team}
							target="_blank"
							rel="noopener"
							className="text-foam hover:text-ember"
						>
							Manage team ↗
						</a>
					</div>
				</div>
			) : isError ? (
				<p className="m-0 text-sm text-slate-light">
					Couldn&apos;t load your team right now.
				</p>
			) : (
				<p className="m-0 text-sm text-slate-light">
					You&apos;re not on a team yet — grab teammates and{" "}
					<a
						href={settings.links.team}
						target="_blank"
						rel="noopener"
						className="text-foam hover:text-ember"
					>
						register one ↗
					</a>
					.
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
