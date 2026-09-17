import Link from "next/link";
import settings from "@/lib/config/settings.json";

const LINKS = [
	{ label: "Discord", href: settings.links.discord, external: true },
	{ label: "Devpost", href: settings.links.devpost, external: true },
	{ label: "Floor map", href: "/map", external: false },
	{ label: "FAQ & rules", href: "/help", external: false },
];

export default function QuickLinks() {
	return (
		<div className="flex flex-col gap-2.5 rounded-2xl border border-line p-5">
			{LINKS.map((link) =>
				link.external ? (
					<a
						key={link.label}
						href={link.href}
						target="_blank"
						rel="noopener"
						className="flex justify-between text-[15px] font-medium text-foam hover:text-ember"
					>
						{link.label} <span className="text-slate">↗</span>
					</a>
				) : (
					<Link
						key={link.label}
						href={link.href}
						className="flex justify-between text-[15px] font-medium text-foam hover:text-ember"
					>
						{link.label} <span className="text-slate">→</span>
					</Link>
				)
			)}
		</div>
	);
}
