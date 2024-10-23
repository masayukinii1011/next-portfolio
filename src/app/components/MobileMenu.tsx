"use client";

import Link from "next/link";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetTrigger,
	SheetHeader,
} from "@/components/ui/sheet";
import type { Category } from "@/app/repository/contentful";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MobileMenu({
	categories,
}: {
	categories: Category[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	// 画面遷移時にSheetを閉じる
	useEffect(() => {
		pathname && setIsOpen(false);
	}, [pathname]);

	return (
		<div className="lg:hidden">
			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetTrigger asChild className="text-white">
					<button type="button" className="p-2">
						<svg
							className="w-6 h-6 text-white"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Menu Icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16m-7 6h7"
							/>
						</svg>
					</button>
				</SheetTrigger>
				<SheetContent
					side="top"
					className="pl-1 pr-12 py-0 border-none opacity-80"
				>
					<SheetHeader className="hidden">
						<SheetTitle>Categories</SheetTitle>
						<SheetDescription>Categories</SheetDescription>
					</SheetHeader>
					<nav>
						<ul>
							{categories.map((category) => (
								<li key={category.slug}>
									<Link
										href={`/${category.slug}`}
										className="p-2 inline-block w-full font-bold text-white hover:bg-hover"
									>
										{category.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	);
}
