import settings from "@/lib/config/settings.json";

const FAQS: { q: string; a: string; link?: { href: string; text: string } }[] =
	[
		{
			q: "Where can I go to get help?",
			a: "We have an info booth in the ECoRE Building lobby! You can also see any member of the HackPSU organizing team at the event.",
		},
		{
			q: "Do I need to stay at the event the whole time?",
			a: "You are free to come and go as you please to get some rest, fresh air, or take a break! If you feel like throwing in the towel for the weekend, that's fine too! All that we ask is that you only work on your project while on the premises.",
		},
		{
			q: "Can I sleep at the hackathon?",
			a: "Yes! We have air mattresses for checkout at the registration table starting at 10pm. All we ask is that you treat them nicely and please return them when you're done!",
		},
		{
			q: "Can I be reimbursed for travel?",
			a: "Travel reimbursements will be handled at the registration table Saturday after 3pm and Sunday from 11am-1pm. Please submit your reimbursements via the profile page on the website. For more information, please refer to our Travel Reimbursement Policy.",
			link: {
				href: `${settings.links.main}/travel`,
				text: "Travel Reimbursement Policy",
			},
		},
		{
			q: "How should I submit a project?",
			a: "All projects will be submitted through the HackPSU Devpost AND through the HackPSU main website. To submit on the main website, go to the profile page and select Submit Project. We will then have a judging expo in the building main area. Do NOT submit your project via email, Discord, DM, messenger pigeon, drone, etc. Both hardware and software projects are allowed. Only one Devpost submission per team is needed.",
			link: { href: settings.links.devpost, text: "Devpost" },
		},
		{
			q: "What is Devpost?",
			a: `Devpost is a project submission platform used by many hackathons and technology-focused events. You and/or your team will be asked to submit your project through our ${settings.hackathonName} Devpost. For those who have never used Devpost before or would like a refresher, head over to the info booth!`,
			link: { href: settings.links.devpost, text: "Devpost" },
		},
		{
			q: "When are project submissions due?",
			a: "You must have a Devpost submission created by Sunday 12pm (even if not completed) on our Devpost page. However, you can continue editing the submission until hacking ends on Sunday at 1:45pm.",
			link: { href: settings.links.devpost, text: "Devpost" },
		},
		{
			q: "Is there a code of conduct?",
			a: "All participants are expected to follow the MLH Code of Conduct.",
			link: {
				href: "https://mlh.io/code-of-conduct",
				text: "MLH Code of Conduct",
			},
		},
	];

export default function FaqList() {
	return (
		<div className="mt-5.5 flex flex-col gap-3">
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
					{faq.link && (
						<a
							href={faq.link.href}
							target="_blank"
							rel="noopener"
							className="mt-2 inline-block text-[15px] text-foam hover:text-ember"
						>
							{faq.link.text} ↗
						</a>
					)}
				</details>
			))}
		</div>
	);
}
