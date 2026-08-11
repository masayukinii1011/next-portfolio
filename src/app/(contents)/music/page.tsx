import PostDetail from "@/app/components/PostDetail";
import RouteTransition from "@/app/components/RouteTransition";
import { getPostBySlug } from "@/app/contentful";
import { DEFAULT_MUSIC_EMBEDS, embedUrlsToEmbeds } from "@/data/music-embeds";
import { buildDescription } from "@/lib/contentful-utils";
import { DEFAULT_DESCRIPTION, createPageMetadata } from "@/lib/metadata";
import { enrichMusicEmbeds } from "@/lib/soundcloud";
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

	const baseEmbeds = post?.embedUrls?.length
		? embedUrlsToEmbeds(post.embedUrls)
		: DEFAULT_MUSIC_EMBEDS;
	const musicEmbeds = await enrichMusicEmbeds(baseEmbeds);

	if (!post) {
		return (
			<RouteTransition>
				<PostDetail
					title="MUSIC"
					category="music"
					imageUrl=""
					imageTitle=""
					githubUrl=""
					demoUrl=""
					body=""
					musicEmbeds={musicEmbeds}
				/>
			</RouteTransition>
		);
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
				musicEmbeds={musicEmbeds}
			/>
		</RouteTransition>
	);
}
