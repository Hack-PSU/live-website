"use client";

import Image from "next/image";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import {
	useAppleWalletCreatePass,
	useUserGetMyInfo,
	useWalletCreatePass,
} from "@hackpsu/react-sdk";
import { useMyTeam } from "@/lib/hooks/use-my-team";
import settings from "@/lib/config/settings.json";

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			{label} <strong className="text-foam">{value}</strong>
		</div>
	);
}

export default function HackerPass() {
	// Retried because this fires as soon as the session resolves, and the first
	// attempt can beat the API's view of a freshly minted token.
	const {
		data: me,
		isLoading,
		isError,
	} = useUserGetMyInfo({ query: { retry: 2, retryDelay: 1000 } });
	const { team } = useMyTeam(me?.id);
	const googlePass = useWalletCreatePass();
	const applePass = useAppleWalletCreatePass();

	if (isLoading) {
		return (
			<p className="mt-5 text-[15px] text-slate-light">Loading your pass…</p>
		);
	}

	if (isError || !me) {
		return (
			<p className="mt-5 text-[15px] text-slate-light">
				We couldn&apos;t load your pass. Make sure you&apos;re registered for{" "}
				{settings.hackathonName}, then reload.
			</p>
		);
	}

	// A signed-in account with no user profile comes back as `{}`, which the
	// document does not describe: it marks `id` required. Keep the guard.
	if (!me.id) {
		return (
			<p className="mt-5 text-[15px] text-slate-light">
				No hacker profile on this account yet. Register for{" "}
				<a href={settings.links.main} className="text-foam hover:text-ember">
					{settings.hackathonName}
				</a>{" "}
				to get your pass.
			</p>
		);
	}

	const addToGoogleWallet = () => {
		googlePass.mutate(
			{ id: me.id },
			{
				onSuccess: (data) => window.open(data.walletLink, "_blank", "noopener"),
				onError: () => toast.error("Couldn't create a Google Wallet pass."),
			}
		);
	};

	const addToAppleWallet = () => {
		applePass.mutate(
			{ id: me.id },
			{
				onSuccess: (blob) => {
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = "hackpsu.pkpass";
					a.click();
					URL.revokeObjectURL(url);
				},
				onError: () => toast.error("Couldn't create an Apple Wallet pass."),
			}
		);
	};

	return (
		<div className="relative mt-5 overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(150deg,#10384F,#0A1E2E)] p-6.5">
			<div className="hex absolute -right-10 -top-10 h-[200px] w-[180px] bg-ember/[.16]" />

			<div className="relative flex items-center gap-3.5">
				<Image
					src="/hackpsu-logo.png"
					alt=""
					width={38}
					height={38}
					className="h-[38px] w-[38px] object-contain"
				/>
				<div className="font-mono text-[10px] font-bold tracking-[.24em] text-ember">
					HACKER PASS · {settings.hackathonDateRepr.toUpperCase()}
				</div>
			</div>

			<h2 className="relative mb-1 mt-4.5 font-condensed text-[42px] font-bold uppercase leading-none text-foam">
				{me.firstName} {me.lastName}
			</h2>
			<p className="relative m-0 text-[15px] text-slate-light">
				{me.university} · {me.major}
			</p>

			<div className="relative mt-5.5 flex flex-wrap items-center gap-5">
				<div className="flex h-[150px] w-[150px] flex-none items-center justify-center rounded-xl bg-foam p-3">
					<QRCode
						value={me.id}
						bgColor="#F2F5FA"
						fgColor="#103850"
						className="h-full w-full"
					/>
				</div>
				<div className="flex min-w-0 flex-col gap-2.5 text-sm text-slate-light">
					{/*
					  TODO(apiv3): check-in time and meal counts live in the scan data
					  (/scans/analytics/events) but there is no per-user rollup endpoint.
					  Wire those two stats once one exists.
					*/}
					{me.registration ? (
						<>
							{/*
							  The document marks applicationStatus optional, but the column is
							  NOT NULL defaulting to "pending" and the entity initializes it,
							  so the fallback is unreachable in practice.
							*/}
							<Stat
								label="Status"
								value={me.registration.applicationStatus ?? "pending"}
							/>
							<Stat label="Year" value={me.registration.academicYear} />
						</>
					) : (
						<div>Not registered for {settings.hackathonName}</div>
					)}
					<Stat label="Team" value={team?.name ?? "No team"} />
					<div className="font-mono text-xs text-slate">{me.id}</div>
				</div>
			</div>

			<div className="relative mt-5.5 flex flex-wrap gap-2.5">
				<button
					type="button"
					onClick={addToAppleWallet}
					disabled={applePass.isPending}
					className="flex-1 rounded-[10px] border border-slate/40 p-3 text-sm font-bold text-foam hover:border-slate disabled:opacity-60"
				>
					{applePass.isPending ? "Creating…" : "Apple Wallet"}
				</button>
				<button
					type="button"
					onClick={addToGoogleWallet}
					disabled={googlePass.isPending}
					className="flex-1 rounded-[10px] border border-slate/40 p-3 text-sm font-bold text-foam hover:border-slate disabled:opacity-60"
				>
					{googlePass.isPending ? "Creating…" : "Google Wallet"}
				</button>
			</div>
		</div>
	);
}
