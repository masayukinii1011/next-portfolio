import type { Category, Image, Post } from "@/app/contentful";

export function ensureString(value: unknown): string {
	return typeof value === "string" ? value : "";
}

export function ensureStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.filter((item): item is string => typeof item === "string");
}

export function ensureCategory(value: unknown): Category {
	const category = {
		slug: "",
		title: "",
	};

	if (
		value &&
		typeof value === "object" &&
		"fields" in value &&
		value.fields &&
		typeof value.fields === "object"
	) {
		if ("slug" in value.fields && typeof value.fields.slug === "string") {
			category.slug = value.fields.slug;
		}
		if ("title" in value.fields && typeof value.fields.title === "string") {
			category.title = value.fields.title;
		}
	}

	return category;
}

export function ensureImage(value: unknown): Image {
	const image = {
		title: "",
		url: "",
	};

	if (
		value &&
		typeof value === "object" &&
		"fields" in value &&
		value.fields &&
		typeof value.fields === "object"
	) {
		if ("title" in value.fields && typeof value.fields.title === "string") {
			image.title = value.fields.title;
		}
		if (
			"file" in value.fields &&
			typeof value.fields.file === "object" &&
			value.fields.file &&
			"url" in value.fields.file &&
			typeof value.fields.file.url === "string"
		) {
			image.url = `https:${value.fields.file.url}`;
		}
	}

	return image;
}

type RawPostFields = {
	slug?: unknown;
	title?: unknown;
	body?: unknown;
	publishDate?: unknown;
	githubUrl?: unknown;
	demoUrl?: unknown;
	category?: unknown;
	image?: unknown;
	techTags?: unknown;
	embedUrls?: unknown;
};

export function extractTechTagsFromBody(body: string): string[] {
	const match = body.match(/## 技術スタック\s*\n+([\s\S]*?)(?=\n## |\n### |$)/);
	if (!match) {
		return [];
	}

	return match[1]
		.split(/[\n,/]/)
		.map((item) => item.replace(/^[-*]\s*/, "").trim())
		.filter(Boolean)
		.slice(0, 6);
}

export function convertPostFields(fields: RawPostFields): Post {
	const body = ensureString(fields.body);
	const techTags = ensureStringArray(fields.techTags);

	return {
		slug: ensureString(fields.slug),
		title: ensureString(fields.title),
		body,
		publishDate: ensureString(fields.publishDate),
		githubUrl: ensureString(fields.githubUrl),
		demoUrl: ensureString(fields.demoUrl),
		category: ensureCategory(fields.category),
		image: ensureImage(fields.image),
		techTags: techTags.length > 0 ? techTags : extractTechTagsFromBody(body),
		embedUrls: ensureStringArray(fields.embedUrls),
	};
}

export function stripMarkdown(text: string): string {
	return text
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`[^`]+`/g, "")
		.replace(/!\[[^\]]*\]\([^)]+\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/^#{1,6}\s+/gm, "")
		.replace(/[*_~>]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

export function buildDescription(body: string, fallback = ""): string {
	const plain = stripMarkdown(body);
	if (!plain) {
		return fallback;
	}
	return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
}
