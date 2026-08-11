import {
	buildDescription,
	convertPostFields,
	ensureCategory,
	ensureImage,
	ensureString,
	ensureStringArray,
	extractTechTagsFromBody,
	stripMarkdown,
} from "@/lib/contentful-utils";
import { describe, expect, it } from "vitest";

describe("ensureString", () => {
	it("returns string values as-is", () => {
		expect(ensureString("hello")).toBe("hello");
	});

	it("returns empty string for non-string values", () => {
		expect(ensureString(123)).toBe("");
		expect(ensureString(null)).toBe("");
	});
});

describe("ensureStringArray", () => {
	it("filters non-string values", () => {
		expect(ensureStringArray(["a", 1, "b"])).toEqual(["a", "b"]);
	});

	it("returns empty array for invalid input", () => {
		expect(ensureStringArray("invalid")).toEqual([]);
	});
});

describe("ensureCategory", () => {
	it("extracts category fields from Contentful entry", () => {
		const category = ensureCategory({
			fields: {
				slug: "works",
				title: "Works",
			},
		});

		expect(category).toEqual({ slug: "works", title: "Works" });
	});
});

describe("ensureImage", () => {
	it("builds image url from Contentful asset", () => {
		const image = ensureImage({
			fields: {
				title: "Cover",
				file: { url: "//images.ctfassets.net/example.png" },
			},
		});

		expect(image).toEqual({
			title: "Cover",
			url: "https://images.ctfassets.net/example.png",
		});
	});
});

describe("extractTechTagsFromBody", () => {
	it("parses tags from markdown tech stack section", () => {
		const body =
			"## 技術スタック\n\nNext.js / TypeScript / AWS\n\n## 成果・学び\n\n完了";
		expect(extractTechTagsFromBody(body)).toEqual([
			"Next.js",
			"TypeScript",
			"AWS",
		]);
	});
});

describe("convertPostFields", () => {
	it("maps raw fields to Post shape", () => {
		const post = convertPostFields({
			slug: "sample",
			title: "Sample",
			body: "Body",
			publishDate: "2024-01-01",
			githubUrl: "https://github.com/example",
			demoUrl: "",
			techTags: ["Next.js", "TypeScript"],
			embedUrls: ["https://example.com/embed"],
			category: { fields: { slug: "works", title: "Works" } },
			image: {
				fields: {
					title: "Thumb",
					file: { url: "//images.ctfassets.net/thumb.png" },
				},
			},
		});

		expect(post.slug).toBe("sample");
		expect(post.techTags).toEqual(["Next.js", "TypeScript"]);
		expect(post.embedUrls).toEqual(["https://example.com/embed"]);
		expect(post.category.slug).toBe("works");
	});
});

describe("stripMarkdown", () => {
	it("removes markdown syntax", () => {
		const plain = stripMarkdown("## Title\n\nHello **world**");
		expect(plain).toBe("Title Hello world");
	});
});

describe("buildDescription", () => {
	it("truncates long descriptions", () => {
		const body = `# Title\n\n${"a".repeat(200)}`;
		const description = buildDescription(body, "fallback");
		expect(description.length).toBeLessThanOrEqual(160);
	});

	it("uses fallback for empty body", () => {
		expect(buildDescription("", "fallback")).toBe("fallback");
	});
});
