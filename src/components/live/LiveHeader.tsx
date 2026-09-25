"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hex from "./Hex";
import { cn } from "@/lib/utils";
import { useLiveClock } from "@/lib/hooks/use-live-clock";
import { formatClock } from "@/lib/events";
import settings from "@/lib/config/settings.json";

const NAV = [
	{ href: "/", label: "Dashboard" },
	{ href: "/schedule", label: "Schedule" },
	{ href: "/map", label: "Floor map" },
	{ href: "/pass", label: "My pass" },
];

const navItemClasses = (active: boolean) =>
	cn(
		"flex min-h-12 items-center gap-3 whitespace-nowrap border-b-2 px-3.5 font-condensed text-base font-semibold uppercase tracking-[.06em] transition-colors",
		active
			? "border-ember bg-ember/[.14] text-foam"
			: "border-transparent text-slate-light hover:text-foam"
	);

export default function LiveHeader() {
	const pathname = usePathname();
	const now = useLiveClock();

	return (
		<header className="sticky top-0 z-30 flex flex-wrap items-stretch gap-x-5 border-b border-line bg-ink-deep px-7">
			<Link href="/" className="flex items-center gap-2.5 py-2.5">
				<Image
					src="/hackpsu-logo.png"
					alt="HackPSU"
					width={38}
					height={38}
					priority
					className="h-[38px] w-[38px] flex-none object-contain"
				/>
				<span className="block">
					<span className="block font-condensed text-[19px] font-bold uppercase leading-none tracking-[.06em] text-foam">
						HackPSU
					</span>
					<span className="mt-[3px] block font-mono text-[9px] font-bold tracking-[.26em] text-ember">
						LIVE
					</span>
				</span>
			</Link>

			<nav className="order-3 flex min-w-0 flex-[1_1_100%] flex-wrap items-stretch gap-0.5">
				{NAV.map((item) => {
					const active =
						item.href === "/"
							? pathname === "/"
							: pathname.startsWith(item.href);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={navItemClasses(active)}
						>
							<Hex size={11} color={active ? "#E07050" : "#7088B8"} />
							{item.label}
						</Link>
					);
				})}
				<a
					href={settings.links.discord}
					target="_blank"
					rel="noopener"
					className={cn(navItemClasses(false), "border-transparent")}
				>
					<Hex size={11} />
					Get help ↗
				</a>
			</nav>

			<div className="ml-auto flex flex-wrap items-center gap-x-[18px] gap-y-2 py-2.5 text-[13px] text-slate-light">
				<span className="flex items-center gap-2">
					<Hex size={8} color="#E07050" blink />
					<span className="font-mono text-[10px] font-bold tracking-[.2em] text-ember">
						{now === null ? "--:-- ET" : formatClock(now)}
					</span>
				</span>
				<span>
					Wi-Fi <strong className="text-foam">{settings.wifi}</strong>
				</span>
				<a href={settings.links.main} className="text-slate hover:text-foam">
					hackpsu.org ↗
				</a>
			</div>
		</header>
	);
}
