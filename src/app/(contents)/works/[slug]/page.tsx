import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug } from "@/app/contentful";

type Props = {
	params: { slug: string };
};

export default async function WorksSlugPage({ params }: Props) {
	const { slug } = await params;
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
			githubUrl={post.githubUrl}
			demoUrl={post.demoUrl}
			body={post.body}
		/>
	);
}
