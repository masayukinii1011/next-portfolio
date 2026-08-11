import { buildDescription } from "@/lib/contentful-utils";
import type { Metadata } from "next";

export const SITE_URL = "https://msykn.com";
export const SITE_NAME = "msykn's portfolio";
export const DEFAULT_DESCRIPTION =
	"フロントエンドから AWS まで対応するフルスタックエンジニア msykn のポートフォリオサイト";

export { buildDescription };

type PageMetadataOptions = {
	title: string;
	description?: string;
	path?: string;
	imageUrl?: string;
};

export function createPageMetadata({
	title,
	description = DEFAULT_DESCRIPTION,
	path = "",
	imageUrl,
}: PageMetadataOptions): Metadata {
	const url = `${SITE_URL}${path}`;
	const fullTitle =
		path === "" || path === "/" ? SITE_NAME : `${title} | ${SITE_NAME}`;

	return {
		title: fullTitle,
		description,
		alternates: {
			canonical: url,
		},
		openGraph: {
			title: fullTitle,
			description,
			url,
			siteName: SITE_NAME,
			locale: "ja_JP",
			type: "website",
			...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
		},
		twitter: {
			card: imageUrl ? "summary_large_image" : "summary",
			title: fullTitle,
			description,
			...(imageUrl ? { images: [imageUrl] } : {}),
		},
	};
}
