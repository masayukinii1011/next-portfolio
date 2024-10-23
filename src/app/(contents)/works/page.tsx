import PostList from "@/app/components/PostList";
import { getPostsByCategory } from "@/app/repository/contentful";

export default async function Works() {
	const posts = await getPostsByCategory("works")
		.then((posts) =>
			posts.map((post) => ({
				title: post.title,
				slug: post.slug,
				imageUrl: post.image.url,
				imageTitle: post.image.title,
			})),
		)
		.catch((error) => {
			console.error("Failed to fetch entries:", error);
			return [];
		});

	return (
		<PostList category={{ title: "WORKS", slug: "works" }} posts={posts} />
	);
}
