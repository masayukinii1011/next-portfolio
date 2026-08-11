import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug } from "@/app/contentful";
import { buildDescription } from "@/lib/contentful-utils";
import { DEFAULT_DESCRIPTION, createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const post = await getPostBySlug("music").catch(() => null);

	if (!post) {
		return createPageMetadata({
			title: "Music",
			description: "msykn の音楽活動",
			path: "/music",
		});
	}

	return createPageMetadata({
		title: post.title,
		description: buildDescription(post.body, DEFAULT_DESCRIPTION),
		path: "/music",
	});
}

export default async function MusicPage() {
	const post = await getPostBySlug("music").catch((error) => {
		console.error("Failed to fetch music post:", error);
		return null;
	});

	if (!post) {
		return (
			<PostDetail
				title="MUSIC"
				category="music"
				imageUrl=""
				imageTitle=""
				githubUrl=""
				demoUrl=""
				body=""
			/>
		);
	}

	return (
		<PostDetail
			title={post.title.toUpperCase()}
			category={post.category.slug}
			imageUrl={post.image.url}
			imageTitle={post.image.title}
			githubUrl={post.githubUrl}
			demoUrl={post.demoUrl}
			body={post.body}
			embedUrls={post.embedUrls}
		/>
	);
}
