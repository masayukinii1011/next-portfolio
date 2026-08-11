import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug, getPostSlugsByCategorySlug } from "@/app/contentful";
import { buildDescription } from "@/lib/contentful-utils";
import { DEFAULT_DESCRIPTION, createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug).catch(() => null);

	if (!post) {
		return createPageMetadata({
			title: "Works",
			description: DEFAULT_DESCRIPTION,
			path: `/works/${slug}`,
		});
	}

	return createPageMetadata({
		title: post.title,
		description: buildDescription(
			post.body,
			`${post.title} - msykn's portfolio`,
		),
		path: `/works/${post.slug}`,
		imageUrl: post.image.url || undefined,
	});
}

export default async function WorksSlugPage({ params }: Props) {
	const { slug } = await params;
	const post = await getPostBySlug(slug).catch((error) => {
		console.error("Failed to fetch post:", error);
		return null;
	});

	if (!post) {
		notFound();
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
