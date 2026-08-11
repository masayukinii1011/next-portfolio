import { getCategories, getPostSlugsByCategorySlug } from "@/app/contentful";
import { SITE_URL } from "@/lib/metadata";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const staticPages: MetadataRoute.Sitemap = [
		{ url: SITE_URL, changeFrequency: "monthly", priority: 1 },
	];

	try {
		const categories = await getCategories();
		for (const category of categories) {
			staticPages.push({
				url: `${SITE_URL}/${category.slug}`,
				changeFrequency: "monthly",
				priority: 0.8,
			});

			if (category.slug === "works") {
				const slugs = await getPostSlugsByCategorySlug("works");
				for (const slug of slugs) {
					staticPages.push({
						url: `${SITE_URL}/works/${slug}`,
						changeFrequency: "monthly",
						priority: 0.7,
					});
				}
			}
		}
	} catch (error) {
		console.error("Failed to generate sitemap:", error);
	}

	return staticPages;
}
