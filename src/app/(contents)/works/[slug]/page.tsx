import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug } from "@/app/contentful";

export default async function Page(props: { params: { slug: string } }) {
	const { slug } = await props.params;
	const post = await getPostBySlug(slug).catch((error) => {
		console.error("Failed to fetch post:", error);
		return null;
	});

	if (!post) {
		return <div>Post not found</div>;
	}

	return (
		<PostDetail
			title={post.title}
			category={post.category.slug}
			imageUrl={post.image.url}
			imageTitle={post.image.title}
			githubLink={post.githubLink}
			demoLink={post.demoLink}
			body={post.body}
		/>
	);
}
