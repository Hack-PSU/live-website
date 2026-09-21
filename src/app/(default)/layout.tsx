import LiveHeader from "@/components/live/LiveHeader";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-ink text-foam">
			<LiveHeader />
			<div className="min-w-0">{children}</div>
		</div>
	);
}
