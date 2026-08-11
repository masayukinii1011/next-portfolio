import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import Header from "@/app/components/Header";
import { Toaster } from "@/components/ui/toaster";
import {
	DEFAULT_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	createPageMetadata,
} from "@/lib/metadata";

const geistSans = localFont({
	src: "../../public/fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "../../public/fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	...createPageMetadata({
		title: SITE_NAME,
		description: DEFAULT_DESCRIPTION,
		path: "/",
	}),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<link rel="icon" href="/favicon.ico" sizes="any" />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-slate-50 break-words`}
			>
				<a
					href="#main"
					className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-foreground focus:rounded-md"
				>
					メインコンテンツへスキップ
				</a>
				<Header />
				<main id="main">{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
