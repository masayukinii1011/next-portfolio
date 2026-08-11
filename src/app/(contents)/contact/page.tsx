import PostDetail from "@/app/components/PostDetail";
import { getPostBySlug } from "@/app/contentful";
import { buildDescription } from "@/lib/contentful-utils";
import { DEFAULT_DESCRIPTION, createPageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const post = await getPostBySlug("contact").catch(() => null);

	if (!post) {
		return createPageMetadata({
			title: "Contact",
			description: "msykn へのお問い合わせ",
			path: "/contact",
		});
	}

	return createPageMetadata({
		title: post.title,
		description: buildDescription(post.body, "msykn へのお問い合わせ"),
		path: "/contact",
	});
}

export default async function ContactPage() {
	const post = await getPostBySlug("contact").catch((error) => {
		console.error("Failed to fetch contact post:", error);
		return null;
	});

	if (!post) {
		return (
			<PostDetail
				title="CONTACT"
				category="contact"
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
		/>
	);
}
