"use client";

import HackerPass from "@/components/live/HackerPass";

export default function PassPage() {
	return (
		<main className="max-w-[520px] px-5 pb-16 pt-8 md:px-10">
			<h1 className="m-0 font-condensed text-[52px] font-bold uppercase text-foam">
				My pass
			</h1>
			<HackerPass />
		</main>
	);
}
