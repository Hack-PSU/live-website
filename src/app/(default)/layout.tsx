import LiveHeader from "@/components/live/LiveHeader";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-ink text-foam">
			<LiveHeader />
			<div className="mx-auto min-w-0 max-w-[1180px]">{children}</div>
		</div>
	);
}
