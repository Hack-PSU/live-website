import type { Metadata } from "next";

import FloorMap from "@/components/live/FloorMap";

export const metadata: Metadata = { title: "Floor map" };

export default function MapPage() {
	return (
		<main className="max-w-[1180px] px-5 pb-16 pt-8 md:px-10">
			<h1 className="m-0 font-condensed text-[52px] font-bold uppercase text-foam">
				Floor map
			</h1>
			<FloorMap />
		</main>
	);
}
