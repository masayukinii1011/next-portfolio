import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug } from "@/app/contentful";

export default async function AboutPage() {
	const post = await getPostBySlug("about").catch((error) => {
		console.error("Failed to fetch post:", error);
		return null;
	});

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<PostDetail
			title={post.title.toUpperCase()}
			category={post.category.slug}
			imageUrl={post.image.url}
			imageTitle={post.image.title}
			githubLink={post.githubLink}
			demoLink={post.demoLink}
			body={post.body}
		/>
	);
}
