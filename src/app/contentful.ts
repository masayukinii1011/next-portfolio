import { convertPostFields } from "@/lib/contentful-utils";
import * as contentful from "contentful";

export type Post = {
	slug: string;
	title: string;
	body: string;
	publishDate: string;
	githubUrl: string;
	demoUrl: string;
	category: Category;
	image: Image;
	techTags: string[];
	embedUrls: string[];
};

export type Category = {
	slug: string;
	title: string;
};

export type Image = {
	title: string;
	url: string;
};

function convertPost(
	entry: contentful.Entry<contentful.EntrySkeletonType, undefined, string>,
): Post {
	return convertPostFields(entry.fields);
}

function ensureString(value: unknown): string {
	return typeof value === "string" ? value : "";
}

const client = contentful.createClient({
	space: process.env.CTF_SPACE_ID || "",
	accessToken: process.env.CTF_CDA_ACCESS_TOKEN || "",
});

const contentType = process.env.CTF_BLOG_POST_TYPE_ID || "";

export async function getCategories(): Promise<Category[]> {
	try {
		const entries = await client.getEntries({
			content_type: "category",
			order: ["fields.id"],
		});
		const categories = entries.items.map((item) => {
			return {
				title: item.fields.title as string,
				slug: item.fields.slug as string,
			};
		});
		return categories;
	} catch (error) {
		console.error("Error fetching categories:", error);
		throw error;
	}
}

export async function getPostsByCategorySlug(
	categorySlug: string,
): Promise<Post[]> {
	try {
		const entries = await client.getEntries({
			content_type: contentType,
			order: ["-fields.publishDate"],
			"fields.category.fields.slug": categorySlug,
			"fields.category.sys.contentType.sys.id": "category",
		});
		return entries.items.map((item) => convertPost(item));
	} catch (error) {
		console.error("Error fetching posts:", error);
		throw error;
	}
}

export async function getPostBySlug(postSlug: string): Promise<Post | null> {
	try {
		const entries = await client.getEntries({
			content_type: contentType,
			limit: 1,
			"fields.slug": postSlug,
		});
		if (entries.items.length === 0) {
			return null;
		}
		return convertPost(entries.items[0]);
	} catch (error) {
		console.error("Error fetching post:", error);
		throw error;
	}
}

export async function getPostSlugsByCategorySlug(
	categorySlug: string,
): Promise<string[]> {
	try {
		const entries = await client.getEntries({
			content_type: contentType,
			select: ["fields.slug"],
			"fields.category.fields.slug": categorySlug,
			"fields.category.sys.contentType.sys.id": "category",
		});
		return entries.items.map((item) => ensureString(item.fields.slug));
	} catch (error) {
		console.error("Error fetching post slugs:", error);
		throw error;
	}
}

export async function getLatestPostsByCategorySlug(
	categorySlug: string,
	limit = 3,
): Promise<Post[]> {
	const posts = await getPostsByCategorySlug(categorySlug);
	return posts.slice(0, limit);
}
