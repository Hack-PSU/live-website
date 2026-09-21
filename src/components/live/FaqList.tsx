const FAQS = [
	{
		q: "Where do I go for help?",
		a: "Post to the mentor queue from the dashboard, or find an organizer in an orange shirt at the Atrium desk.",
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
		<div className="mt-5.5 flex flex-col gap-3">
			{FAQS.map((faq) => (
				<div
					key={faq.q}
					className="rounded-2xl border border-line bg-surface px-5.5 py-5"
				>
					<h3 className="m-0 font-condensed text-2xl font-semibold uppercase text-foam">
						{faq.q}
					</h3>
					<p className="m-0 mt-2 text-[15px] leading-[1.55] text-slate-light [text-wrap:pretty]">
						{faq.a}
					</p>
				</div>
			))}
		</div>
	);
}
