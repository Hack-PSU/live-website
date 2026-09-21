"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FirebaseProvider } from "./FirebaseProvider";

export default function LayoutProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	// One client per browser session. Created in state rather than at module
	// scope so a re-render never swaps the cache out from under the tree.
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
						refetchOnWindowFocus: false,
					},
				},
			})
	);

	return (
		<FirebaseProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</FirebaseProvider>
	);
}
