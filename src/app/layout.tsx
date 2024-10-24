import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import Header from "@/app/components/Header";
import { Toaster } from "@/components/ui/toaster";

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
	title: "msykn's portfolio",
	description: "msykn's portfolio",
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
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen break-all`}
			>
				<Header />
				{children}
				<Toaster />
			</body>
		</html>
	);
}
