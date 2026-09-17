import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans, Orbitron } from "next/font/google";

import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";

const barlow = Barlow_Condensed({
	subsets: ["latin"],
	weight: ["500", "600", "700"],
	variable: "--font-barlow",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-dm-sans",
});

const orbitron = Orbitron({
	subsets: ["latin"],
	weight: ["500", "700"],
	variable: "--font-orbitron",
});

export const metadata: Metadata = {
	title: {
		default: "HackPSU Live",
		template: "%s | HackPSU Live",
	},
	description:
		"Live schedule, announcements, floor map, and your hacker pass for HackPSU at Penn State.",
	authors: [{ name: "HackPSU Team", url: "https://hackpsu.org" }],
	creator: "HackPSU",
	publisher: "HackPSU",
	metadataBase: new URL("https://live.hackpsu.org"),
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://live.hackpsu.org",
		siteName: "HackPSU Live",
		title: "HackPSU Live",
		description:
			"Live schedule, announcements, floor map, and your hacker pass for HackPSU at Penn State.",
		images: [{ url: "/hackpsu-logo.png", alt: "HackPSU" }],
	},
	robots: { index: true, follow: true },
	category: "technology",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	colorScheme: "dark",
	themeColor: "#0A1E2E",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${barlow.variable} ${dmSans.variable} ${orbitron.variable}`}
		>
			<body className="font-sans antialiased">
				<LayoutProvider>{children}</LayoutProvider>
			</body>
		</html>
	);
}
