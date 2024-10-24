import type { Category } from "@/app/contentful";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function PcMenu({
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
								className="center white-bold h-14 px-2 hover:bg-hover"
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
