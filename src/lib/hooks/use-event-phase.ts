"use client";

export type EventPhase = "before" | "during" | "after";

export interface PhaseState {
	phase: EventPhase;
	/** Countdown to the phase's target, zero-padded for display. */
	days: string;
	hours: string;
	minutes: string;
	seconds: string;
	/** 0–100, how far through the hackathon we are. */
	progress: number;
	label: string;
	sublabel: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Derives the mission-clock state from the active hackathon's window.
 *
 * Before the start we count down to hacking; during, we count down to
 * submissions closing. The design only covers those two, so "after" is ours.
 */
export function useEventPhase(
	startTime: number,
	endTime: number,
	now: number | null
): PhaseState {
	const current = now ?? startTime;
	const phase: EventPhase =
		current < startTime ? "before" : current < endTime ? "during" : "after";

	const target = phase === "before" ? startTime : endTime;
	let remaining = Math.max(0, Math.floor((target - current) / 1000));

	const days = Math.floor(remaining / 86_400);
	remaining -= days * 86_400;
	const hours = Math.floor(remaining / 3600);
	remaining -= hours * 3600;
	const minutes = Math.floor(remaining / 60);
	const seconds = remaining - minutes * 60;

	const span = endTime - startTime;
	const progress =
		span > 0
			? Math.min(100, Math.max(0, ((current - startTime) / span) * 100))
			: 0;

	const copy = {
		before: {
			label: "UNTIL HACKING STARTS",
			sublabel: "Doors open Saturday morning",
		},
		during: {
			label: "LEFT TO SUBMIT",
			sublabel: "Devpost closes when the clock runs out",
		},
		after: {
			label: "THANKS FOR HACKING",
			sublabel: "Judging is underway — results at the closing ceremony",
		},
	}[phase];

	return {
		phase,
		days: pad(days),
		hours: pad(hours),
		minutes: pad(minutes),
		seconds: pad(seconds),
		progress,
		...copy,
	};
}
