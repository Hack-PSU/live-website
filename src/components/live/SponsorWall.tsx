import type { SponsorEntity } from "@/lib/api/sponsor";

interface Props {
	sponsors: SponsorEntity[];
	isLoading: boolean;
}

function SponsorTile({ sponsor }: { sponsor: SponsorEntity }) {
	// Same preference as frontend-template's sponsor section.
	const logo = sponsor.darkLogo || sponsor.lightLogo;

	const body = (
		<div className="flex h-24 items-center justify-center rounded-xl border border-line bg-surface px-4 py-3">
			{logo ? (
				// Logos are hosted wherever organizers uploaded them, so skip the
				// next/image host allowlist.
				// eslint-disable-next-line @next/next/no-img-element
				<img
					src={logo}
					alt={sponsor.name}
					loading="lazy"
					className="max-h-full max-w-full object-contain"
				/>
			) : (
				<span className="text-center font-condensed text-xl font-semibold uppercase text-foam">
					{sponsor.name}
				</span>
			)}
		</div>
	);

	return sponsor.link ? (
		<a
			href={sponsor.link}
			target="_blank"
			rel="noopener"
			className="block transition-opacity hover:opacity-80"
		>
			{body}
		</a>
	) : (
		body
	);
}

export default function SponsorWall({ sponsors, isLoading }: Props) {
	const main = sponsors.filter((s) => s.sponsorType !== "partner");
	const partners = sponsors.filter((s) => s.sponsorType === "partner");

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

			{main.length > 0 && (
				<div className="mt-4.5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
					{main.map((s) => (
						<SponsorTile key={s.id} sponsor={s} />
					))}
				</div>
			)}

			{partners.length > 0 && (
				<>
					<div className="mt-6 font-mono text-[10px] font-bold tracking-[.22em] text-slate">
						PARTNERS
					</div>
					<div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
						{partners.map((s) => (
							<SponsorTile key={s.id} sponsor={s} />
						))}
					</div>
				</>
			)}
		</div>
	);
}
