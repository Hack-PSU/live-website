"use client";

import { useMemo, useState } from "react";
import Hex from "./Hex";
import { cn } from "@/lib/utils";
import {
	CATEGORIES,
	CATEGORY_ORDER,
	categoryOf,
	formatTime,
	groupByDay,
	type CategoryKey,
	type LiveEvent,
} from "@/lib/events";

interface Props {
	events: LiveEvent[];
	isLoading: boolean;
}

export default function ScheduleTimeline({ events, isLoading }: Props) {
	const [dayIndex, setDayIndex] = useState(0);
	const [hidden, setHidden] = useState<Partial<Record<CategoryKey, boolean>>>(
		{}
	);

	const days = useMemo(() => groupByDay(events), [events]);
	const day = days[Math.min(dayIndex, Math.max(0, days.length - 1))];

	const rows = (day?.events ?? []).filter(
		(event) => !hidden[categoryOf(event).key]
	);

	const toggle = (key: CategoryKey) =>
		setHidden((prev) => ({ ...prev, [key]: !prev[key] }));

	return (
		<>
			<div className="mt-5 flex flex-wrap items-end gap-5.5">
				<div className="flex gap-2">
					{days.map((d, i) => {
						const active = d.key === day?.key;
						return (
							<button
								key={d.key}
								type="button"
								onClick={() => setDayIndex(i)}
								className={cn(
									"rounded-lg border border-slate/30 px-5 py-2.5 font-condensed text-[17px] font-semibold uppercase tracking-[.1em]",
									active
										? "bg-ember text-ink-deep"
										: "bg-transparent text-slate-light"
								)}
							>
								{d.label}
							</button>
						);
					})}
				</div>

				<div className="ml-auto flex flex-wrap gap-2">
					{CATEGORY_ORDER.map((key) => {
						const category = CATEGORIES[key];
						const on = !hidden[key];
						return (
							<button
								key={key}
								type="button"
								aria-pressed={on}
								onClick={() => toggle(key)}
								className={cn(
									"flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-bold",
									on
										? "border-line-strong bg-slate/[.16] text-foam"
										: "border-line bg-transparent text-slate-dim"
								)}
							>
								<Hex size={9} color={category.color} />
								{category.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="mt-6.5">
				{isLoading && (
					<p className="text-[15px] text-slate-light">Loading schedule…</p>
				)}
				{!isLoading && rows.length === 0 && (
					<p className="text-[15px] text-slate-light">
						Nothing matches those filters.
					</p>
				)}
				{rows.map((event) => {
					const category = categoryOf(event);
					return (
						<div
							key={event.id}
							className="grid grid-cols-[72px_minmax(0,1fr)] gap-5 pb-3.5 sm:grid-cols-[96px_minmax(0,1fr)]"
						>
							<div className="pt-4.5 text-right font-mono text-[13px] font-medium text-slate">
								{formatTime(event.startTime)}
							</div>
							<div className="relative border-l border-line pl-5">
								<Hex
									size={11}
									color={category.color}
									className="absolute left-[-6px] top-5.5"
								/>
								<div className="flex items-center gap-4.5 rounded-xl border border-line bg-surface px-4.5 py-3.5">
									<div className="min-w-0 flex-1">
										<div
											className="font-mono text-[10px] font-bold uppercase tracking-[.2em]"
											style={{ color: category.color }}
										>
											{category.label}
										</div>
										<h3 className="m-0 mt-1.5 font-condensed text-[25px] font-semibold uppercase leading-[1.05] text-foam">
											{event.name}
										</h3>
									</div>
									<div className="flex-none text-right text-sm text-slate-light">
										{event.locationName}
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
