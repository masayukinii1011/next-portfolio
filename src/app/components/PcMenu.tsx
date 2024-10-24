import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { Category } from "@/app/contentful";

export default async function PcMenu({
	categories,
}: {
	categories: Category[];
}) {
	return (
		<div className="hidden lg:block">
			<NavigationMenu>
				<NavigationMenuList>
					{categories.map((category) => (
						<NavigationMenuItem key={category.slug}>
							<NavigationMenuLink
								href={`/${category.slug}`}
								className="center px-2 h-14 font-bold text-white hover:bg-hover"
							>
								{category.title}
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
