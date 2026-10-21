"use client";

import { useState } from "react";
import type { SponsorEntity } from "@hackpsu/react-sdk";

interface Props {
	sponsors: SponsorEntity[];
	isLoading: boolean;
}

interface Tier {
	/** Fixed logo box per tier, so higher tiers read bigger regardless of artwork. */
	logoSize: string;
	borderColor: string;
}

/**
 * Tier sizes and border colors from frontend-template's sponsor pyramid, scaled
 * down to sit inside the dashboard. Listed highest tier first.
 */
const TIERS: Record<string, Tier> = {
	title: {
		logoSize: "w-56 h-20 md:w-64 md:h-24 lg:w-80 lg:h-32",
		borderColor: "border-[#FFE4B5]",
	},
	sapphire: {
		logoSize: "w-52 h-20 md:w-60 md:h-24 lg:w-72 lg:h-28",
		borderColor: "border-[#0F52BA]",
	},
	diamond: {
		logoSize: "w-48 h-16 md:w-52 md:h-20 lg:w-60 lg:h-24",
		borderColor: "border-[#b3b3fc]",
	},
	platinum: {
		logoSize: "w-40 h-14 md:w-48 md:h-16 lg:w-52 lg:h-20",
		borderColor: "border-[#B9F2FF]",
	},
	gold: {
		logoSize: "w-36 h-12 md:w-40 md:h-14 lg:w-48 lg:h-16",
		borderColor: "border-[#e3ae32]",
	},
	silver: {
		logoSize: "w-28 h-10 md:w-36 md:h-12 lg:w-40 lg:h-14",
		borderColor: "border-[#a3a3a3]",
	},
	bronze: {
		logoSize: "w-24 h-8 md:w-28 md:h-10 lg:w-36 lg:h-12",
		borderColor: "border-[#a16800]",
	},
};

const TIER_ORDER = Object.keys(TIERS);

const PARTNER_TIER: Tier = {
	logoSize: "w-24 h-8 md:w-28 md:h-10 lg:w-36 lg:h-12",
	borderColor: "border-[#FFE4E6]",
};

/** Levels typed into admin that we don't recognize still show, as bronze. */
function tierKeyOf(sponsor: SponsorEntity): string {
	const level = sponsor.level?.toLowerCase() ?? "";
	return level in TIERS ? level : "bronze";
}

function SponsorTile({
	sponsor,
	tier,
}: {
	sponsor: SponsorEntity;
	tier: Tier;
}) {
	// Tiles are beige, so the light-background logo reads best.
	const logo = sponsor.lightLogo || sponsor.darkLogo;
	// Dead logo URLs fall back to the name instead of a broken-image icon.
	const [broken, setBroken] = useState(false);

	const body = (
		<div
			className={`rounded-xl border-[3px] bg-cream p-4 shadow-lg ${tier.borderColor}`}
		>
			<div className={`flex items-center justify-center ${tier.logoSize}`}>
				{logo && !broken ? (
					// Logos are hosted wherever organizers uploaded them, so skip the
					// next/image host allowlist.
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={logo}
						alt={sponsor.name}
						loading="lazy"
						onError={() => setBroken(true)}
						className="max-h-full max-w-full object-contain"
					/>
				) : (
					<span className="text-center font-condensed text-xl font-semibold uppercase text-ink">
						{sponsor.name}
					</span>
				)}
			</div>
		</div>
	);

	return sponsor.link ? (
		<a
			href={sponsor.link}
			target="_blank"
			rel="noopener"
			className="block transition-transform duration-300 hover:scale-105"
		>
			{body}
		</a>
	) : (
		body
	);
}

export default function SponsorWall({ sponsors, isLoading }: Props) {
	// `sponsors` arrives sorted by `order`, so each tier keeps that order.
	const main = sponsors.filter((s) => s.sponsorType !== "partner");
	const partners = sponsors.filter((s) => s.sponsorType === "partner");
	const tiers = TIER_ORDER.map((key) => ({
		key,
		sponsors: main.filter((s) => tierKeyOf(s) === key),
	})).filter((t) => t.sponsors.length > 0);

	return (
		<div>
			<h2 className="m-0 font-condensed text-[32px] font-bold uppercase text-foam">
				Sponsors
			</h2>

			{isLoading && (
				<p className="mt-4.5 text-[15px] text-slate-light">Loading…</p>
			)}
			{!isLoading && sponsors.length === 0 && (
				<p className="mt-4.5 text-[15px] text-slate-light">
					Sponsors will be announced soon.
				</p>
			)}

			{tiers.length > 0 && (
				<div className="mt-4.5 flex flex-col gap-5">
					{tiers.map((t) => (
						<div key={t.key} className="flex flex-wrap justify-center gap-5">
							{t.sponsors.map((s) => (
								<SponsorTile key={s.id} sponsor={s} tier={TIERS[t.key]} />
							))}
						</div>
					))}
				</div>
			)}

			{partners.length > 0 && (
				<>
					<div className="mt-8 text-center font-mono text-[10px] font-bold tracking-[.22em] text-slate">
						PARTNERS
					</div>
					<div className="mt-3 flex flex-wrap justify-center gap-5">
						{partners.map((s) => (
							<SponsorTile key={s.id} sponsor={s} tier={PARTNER_TIER} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
