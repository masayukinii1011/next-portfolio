import type { Category } from "@/app/contentful";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function PcMenu({
	categories,
}: {
	categories: Category[];
}) {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				{categories.map((category) => (
					<NavigationMenuItem key={category.slug}>
						<NavigationMenuLink asChild>
							<Link
								href={`/${category.slug}`}
								transitionTypes={["nav-forward"]}
								className="center white-bold h-14 px-2 hover:bg-hover"
							>
								{category.title}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}
