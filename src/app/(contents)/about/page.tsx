import PostDetail from "@/app/components/PostDetail";
import RouteTransition from "@/app/components/RouteTransition";
import { getPostBySlug } from "@/app/contentful";
import { buildDescription } from "@/lib/contentful-utils";
import { DEFAULT_DESCRIPTION, createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	const post = await getPostBySlug("about").catch(() => null);

	if (!post) {
		return createPageMetadata({
			title: "About",
			description: DEFAULT_DESCRIPTION,
			path: "/about",
		});
	}

	return createPageMetadata({
		title: post.title,
		description: buildDescription(post.body, DEFAULT_DESCRIPTION),
		path: "/about",
		imageUrl: post.image.url || undefined,
	});
}

export default async function AboutPage() {
	const post = await getPostBySlug("about").catch((error) => {
		console.error("Failed to fetch post:", error);
		return null;
	});

	if (!post) {
		notFound();
	}

	return (
		<RouteTransition>
			<PostDetail
				title={post.title.toUpperCase()}
				category={post.category.slug}
				imageUrl={post.image.url}
				imageTitle={post.image.title}
				githubUrl={post.githubUrl}
				demoUrl={post.demoUrl}
				body={post.body}
			/>
		</RouteTransition>
	);
}
