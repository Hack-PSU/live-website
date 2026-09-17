import Link from "next/link";

export default function NotFound() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-6 text-center">
			<h1 className="m-0 font-condensed text-[52px] font-bold uppercase text-foam">
				Page not found
			</h1>
			<p className="m-0 text-[15px] text-slate-light">
				That page isn&apos;t part of HackPSU Live.
			</p>
			<Link
				href="/"
				className="mt-2 rounded-lg bg-ember px-5 py-2.5 font-condensed text-base font-semibold uppercase tracking-[.1em] text-ink-deep hover:bg-ember-light"
			>
				Back to dashboard
			</Link>
		</main>
	);
}
