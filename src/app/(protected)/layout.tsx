import { Toaster } from "sonner";

import LiveHeader from "@/components/live/LiveHeader";
import { AuthGuard, Role } from "@hackpsu/react-sdk";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-ink text-foam">
			<LiveHeader />
			<Toaster richColors theme="dark" />
			<AuthGuard minimumRole={Role.NONE}>
				<div className="mx-auto min-w-0 max-w-[1180px]">{children}</div>
			</AuthGuard>
		</div>
	);
}
