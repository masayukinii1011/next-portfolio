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
		<header className="flex items-center justify-between w-full px-2 bg-background opacity-90 fixed z-1">
			<Link
				href="/"
				className="center white-bold h-14 px-2 text-2xl hover:bg-hover"
			>
				<h1>msykn</h1>
			</Link>
			<div className="hidden lg:block">
				<PcMenu categories={categories} />
			</div>
			<div className="lg:hidden">
				<MobileMenu categories={categories} />
			</div>
		</header>
	);
}
