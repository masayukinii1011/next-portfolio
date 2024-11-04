import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug, getPostSlugsByCategorySlug } from "@/app/contentful";

type Props = {
	params: Promise<{ slug: string }>;
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

export async function generateStaticParams() {
	const slugs = await getPostSlugsByCategorySlug("works").catch((error) => {
		console.error("Failed to fetch post slugs:", error);
		return [];
	});
	return slugs.map((slug) => ({ slug }));
}
