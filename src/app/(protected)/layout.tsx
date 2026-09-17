import { Toaster } from "sonner";

import LiveHeader from "@/components/live/LiveHeader";
import { AuthGuard, Role } from "@/lib/providers/AuthGuard";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-ink text-foam">
			<LiveHeader />
			<Toaster richColors theme="dark" />
			<AuthGuard config={{ minimumRole: Role.NONE }}>
				<div className="min-w-0">{children}</div>
			</AuthGuard>
		</div>
	);
}
