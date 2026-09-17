import type { Metadata } from "next";

import FaqList from "@/components/live/FaqList";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
	return (
		<main className="max-w-[860px] px-5 pb-16 pt-8 md:px-10">
			<h1 className="m-0 font-condensed text-[52px] font-bold uppercase text-foam">
				Help
			</h1>
			<FaqList />
		</main>
	);
}
