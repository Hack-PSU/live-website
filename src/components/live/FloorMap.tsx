"use client";

import { useState } from "react";
import Hex from "./Hex";
import { cn } from "@/lib/utils";
import settings from "@/lib/config/settings.json";

const FLOORS = ["First floor", "Second floor", "Third floor"];

/*
 * TODO: real ECoRE plan SVGs are not available yet. Drop one file per floor in
 * public/floors/ and render it in place of <PlanPlaceholder /> — the pin list
 * below is already keyed to room names, so pins can become hover targets then.
 */
const PINS = [
	{ name: "Main hacking area", room: "Atrium", color: "#E07050" },
	{ name: "Check-in desk", room: "Lobby", color: "#7088B8" },
	{ name: "Workshops", room: "205 / 207", color: "#64A5C3" },
	{ name: "Sponsor booths", room: "2F bridge", color: "#E2C75E" },
	{ name: "Quiet room", room: "118", color: "#B6663C" },
];

function PlanPlaceholder({ floorName }: { floorName: string }) {
	return (
		<div className="relative mt-3">
			<svg viewBox="0 0 800 440" className="block h-auto w-full">
				<defs>
					<pattern
						id="hpStripe"
						width="12"
						height="12"
						patternTransform="rotate(45)"
						patternUnits="userSpaceOnUse"
					>
						<rect width="12" height="12" fill="#E7ECF3" />
						<rect width="5" height="12" fill="#D9E1EB" />
					</pattern>
				</defs>
				<rect
					x="1.5"
					y="1.5"
					width="797"
					height="437"
					rx="10"
					fill="url(#hpStripe)"
					stroke="#103850"
					strokeWidth="2"
					strokeDasharray="9 8"
				/>
			</svg>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-3 text-center">
				<div className="font-mono text-sm text-navy">
					{floorName} plan SVG goes here
				</div>
				<div className="max-w-[36ch] font-mono text-xs leading-snug text-[#5C7896]">
					rooms become hoverable pins once you drop the file in
				</div>
			</div>
		</div>
	);
}

export default function FloorMap() {
	const [floor, setFloor] = useState(0);
	const floorName = FLOORS[floor];

	return (
		<div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
			<div>
				<div className="flex flex-wrap gap-2">
					{FLOORS.map((name, i) => (
						<button
							key={name}
							type="button"
							onClick={() => setFloor(i)}
							className={cn(
								"rounded-lg border border-slate/30 px-5 py-2.5 font-condensed text-[17px] font-semibold uppercase tracking-[.1em]",
								floor === i
									? "bg-ember text-ink-deep"
									: "bg-transparent text-slate-light"
							)}
						>
							{name}
						</button>
					))}
				</div>

				<div className="mt-3.5 rounded-[18px] bg-foam p-5">
					<div className="flex items-baseline gap-2.5">
						<span className="font-condensed text-[22px] font-bold uppercase text-navy">
							ECoRE · {floorName}
						</span>
						<span className="font-mono text-[10px] tracking-[.2em] text-slate">
							PLACEHOLDER
						</span>
					</div>
					<PlanPlaceholder floorName={floorName} />
				</div>
			</div>

			<div className="flex flex-col gap-3.5">
				<div className="rounded-2xl border border-line bg-surface p-5">
					<div className="font-mono text-[10px] font-bold tracking-[.22em] text-slate">
						VENUE
					</div>
					<h2 className="mb-1.5 mt-2.5 font-condensed text-[30px] font-bold uppercase text-foam">
						{settings.venue.name}
					</h2>
					<p className="m-0 text-sm text-slate-light">
						{settings.venue.address}
					</p>
					<a
						href={settings.venue.directionsUrl}
						target="_blank"
						rel="noopener"
						className="mt-4 inline-block rounded-lg bg-ember px-5 py-2.5 font-condensed text-base font-semibold uppercase tracking-[.1em] text-ink-deep hover:bg-ember-light"
					>
						Directions →
					</a>
				</div>

				<div className="rounded-2xl border border-line p-5">
					<h3 className="m-0 mb-3.5 font-condensed text-xl font-bold uppercase text-foam">
						Key spots
					</h3>
					<div className="flex flex-col gap-3">
						{PINS.map((pin) => (
							<div
								key={pin.name}
								className="flex items-center gap-2.5 text-sm text-slate-light"
							>
								<Hex size={10} color={pin.color} />
								<span className="font-bold text-foam">{pin.name}</span>
								<span className="ml-auto font-mono text-xs">{pin.room}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
