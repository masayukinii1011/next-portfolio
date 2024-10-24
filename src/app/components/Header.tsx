import MobileMenu from "@/app/components/MobileMenu";
import PcMenu from "@/app/components/PcMenu";
import { getCategories } from "@/app/contentful";
import Link from "next/link";

export default async function Header() {
	const categories = await getCategories().catch((error) => {
		console.error("Failed to fetch categories:", error);
		return [];
	});

	return (
		<header className="flex items-center justify-between px-2 bg-background fixed w-full z-1 opacity-90">
			<Link
				href="/"
				className="center text-2xl font-bold text-white px-2 h-14 hover:bg-hover"
			>
				<h1>msykn</h1>
			</Link>
			<PcMenu categories={categories} />
			<MobileMenu categories={categories} />
		</header>
	);
}
