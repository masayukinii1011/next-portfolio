import PostList from "@/app/components/PostList";
import { getPostsByCategorySlug } from "@/app/contentful";
import { createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
	title: "Works",
	description: "msykn の個人開発・技術プロジェクト一覧",
	path: "/works",
});

export default async function WorksPage() {
	const posts = await getPostsByCategorySlug("works")
		.then((posts) =>
			posts.map((post) => ({
				title: post.title,
				slug: post.slug,
				imageUrl: post.image.url,
				imageTitle: post.image.title,
				publishDate: post.publishDate,
				techTags: post.techTags,
			})),
		)
		.catch((error) => {
			console.error("Failed to fetch posts:", error);
			return [];
		});

	return (
		<PostList category={{ title: "WORKS", slug: "works" }} posts={posts} />
	);
}
