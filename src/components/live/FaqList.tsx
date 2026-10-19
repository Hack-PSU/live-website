import StillStuck from "./StillStuck";

const FAQS = [
	{
		q: "Where do I go for help?",
		a: "Ask in the HackPSU Discord, or find an organizer in an orange shirt at the Atrium desk.",
	},
	{
		q: "When are submissions due?",
		a: "Sunday at 10:00 AM on Devpost. Late submissions are not judged, so submit early and keep editing after.",
	},
	{
		q: "Can I sleep at the venue?",
		a: "Yes. ECoRE 118 is the designated quiet room overnight. Bring a blanket — we have a limited supply.",
	},
	{
		q: "Do I need to stay the whole time?",
		a: "No, but you must be present for your expo judging slot on Sunday morning.",
	},
	{
		q: "How does extra credit work?",
		a: "Scan the class QR at the check-in desk and your instructor receives attendance automatically.",
	},
];

export default function FaqList() {
	return (
		<div className="mt-5.5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
			<div className="flex flex-col gap-3">
				{FAQS.map((faq) => (
					<details
						key={faq.q}
						className="group rounded-2xl border border-line bg-surface px-5.5 py-5"
					>
						<summary className="flex cursor-pointer list-none items-center gap-3 font-condensed text-2xl font-semibold uppercase text-foam [&::-webkit-details-marker]:hidden">
							<span className="inline-block transition-transform group-open:rotate-90">
								▸
							</span>
							{faq.q}
						</summary>
						<p className="m-0 mt-2 text-[15px] leading-[1.55] text-slate-light [text-wrap:pretty]">
							{faq.a}
						</p>
					</details>
				))}
			</div>

			<StillStuck />
		</div>
	);
}