"use client";

import { useSyncExternalStore } from "react";

/*
 * A single shared 1s ticker. Every clock on the page reads the same store, so
 * ten countdowns cost one interval rather than ten.
 */
const listeners = new Set<() => void>();
let current = Date.now();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(onChange: () => void) {
	listeners.add(onChange);
	if (timer === null) {
		timer = setInterval(() => {
			current = Date.now();
			listeners.forEach((listener) => listener());
		}, 1000);
	}
	return () => {
		listeners.delete(onChange);
		if (listeners.size === 0 && timer !== null) {
			clearInterval(timer);
			timer = null;
		}
	};
}

const getSnapshot = () => current;

/*
 * Null on the server and through hydration, so a server-rendered timestamp can
 * never disagree with the client's. Consumers must render a placeholder while
 * this is null.
 */
const getServerSnapshot = (): number | null => null;

export function useLiveClock(): number | null {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
