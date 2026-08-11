import { SITE_URL } from "@/lib/metadata";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
