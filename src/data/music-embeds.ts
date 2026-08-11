export type MusicPlatform = "apple-music" | "soundcloud" | "youtube";

export type MusicEmbed = {
	title: string;
	src: string;
	platform: MusicPlatform;
	href?: string;
	playlistId?: string;
	trackCount?: number;
	artworkUrl?: string;
	tracks?: Array<{
		id: number;
		title: string;
		duration: number;
		artworkUrl?: string;
	}>;
	allow?: string;
	sandbox?: string;
};

const APPLE_MUSIC_BASE_HEIGHT = 168;
const APPLE_MUSIC_TRACK_ROW_HEIGHT = 34;
export const SOUNDCLOUD_PLAYER_HEIGHT = 166;
const SOUNDCLOUD_TRACK_ROW_HEIGHT = 52;
export const MUSIC_CARD_HEADER_HEIGHT = 41;
export const MUSIC_CARD_REFERENCE_TRACK_COUNT = 3;

export function getAppleMusicIframeHeight(trackCount: number): number {
	return APPLE_MUSIC_BASE_HEIGHT + trackCount * APPLE_MUSIC_TRACK_ROW_HEIGHT;
}

export function getSoundCloudTrackListHeight(trackCount: number): number {
	return trackCount * SOUNDCLOUD_TRACK_ROW_HEIGHT;
}

export function getUnifiedMusicCardTrackListHeight(): number {
	return getSoundCloudTrackListHeight(MUSIC_CARD_REFERENCE_TRACK_COUNT);
}

export function getUnifiedMusicCardBodyHeight(): number {
	return SOUNDCLOUD_PLAYER_HEIGHT + getUnifiedMusicCardTrackListHeight();
}

export function getUnifiedMusicCardHeight(): number {
	return MUSIC_CARD_HEADER_HEIGHT + getUnifiedMusicCardBodyHeight();
}

export function getSoundCloudCardHeight(trackCount: number): number {
	return (
		MUSIC_CARD_HEADER_HEIGHT +
		SOUNDCLOUD_PLAYER_HEIGHT +
		getSoundCloudTrackListHeight(trackCount)
	);
}

export function buildSoundCloudPlaylistSrc(playlistId: string): string {
	const params = new URLSearchParams({
		url: `https://api.soundcloud.com/playlists/${playlistId}`,
		color: "#ff5500",
		auto_play: "false",
		hide_related: "true",
		show_comments: "false",
		show_user: "true",
		show_reposts: "false",
		show_teaser: "false",
		show_artwork: "false",
		visual: "false",
	});

	return `https://w.soundcloud.com/player/?${params.toString()}`;
}

export const DEFAULT_MUSIC_EMBEDS: MusicEmbed[] = [
	{
		title: "Matters of the Affection",
		platform: "apple-music",
		trackCount: 10,
		href: "https://music.apple.com/jp/album/matters-of-the-affection/1536910723",
		src: "https://embed.music.apple.com/jp/album/matters-of-the-affection/1536910723",
		allow: "encrypted-media *; fullscreen *",
		sandbox:
			"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
	},
	{
		title: "Underneath the City of the Bloom",
		platform: "apple-music",
		trackCount: 4,
		href: "https://music.apple.com/jp/album/underneath-the-city-of-the-bloom/1334493546",
		src: "https://embed.music.apple.com/jp/album/underneath-the-city-of-the-bloom/1334493546",
		allow: "encrypted-media *; fullscreen *",
		sandbox:
			"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
	},
	{
		title: "Heart",
		platform: "soundcloud",
		trackCount: 4,
		href: "https://soundcloud.com/msyknjmyk/sets/heart",
		playlistId: "1486647112",
		src: buildSoundCloudPlaylistSrc("1486647112"),
		allow: "autoplay; encrypted-media",
	},
	{
		title: "Purpose",
		platform: "soundcloud",
		trackCount: 7,
		href: "https://soundcloud.com/msyknjmyk/sets/purpose",
		playlistId: "1092547429",
		src: buildSoundCloudPlaylistSrc("1092547429"),
		allow: "autoplay; encrypted-media",
	},
	{
		title: "YouTube Video 1",
		platform: "youtube",
		src: "https://www.youtube.com/embed/oDQt5m3BVD8",
	},
	{
		title: "YouTube Video 2",
		platform: "youtube",
		src: "https://www.youtube.com/embed/l9yCRuFNKIY",
	},
	{
		title: "YouTube Video 3",
		platform: "youtube",
		src: "https://www.youtube.com/embed/2B2w8jNjoF8",
	},
	{
		title: "YouTube Video 4",
		platform: "youtube",
		src: "https://www.youtube.com/embed/d1UjjotarFQ",
	},
	{
		title: "YouTube Video 5",
		platform: "youtube",
		src: "https://www.youtube.com/embed/f7AZRGglSQw",
	},
	{
		title: "YouTube Video 6",
		platform: "youtube",
		src: "https://www.youtube.com/embed/EYCjx8QpWJE",
	},
	{
		title: "YouTube Video 7",
		platform: "youtube",
		src: "https://www.youtube.com/embed/gUN3lEoVzr8",
	},
	{
		title: "YouTube Video 8",
		platform: "youtube",
		src: "https://www.youtube.com/embed/c54cX6OK050",
	},
];

function inferPlatform(src: string): MusicPlatform {
	if (src.includes("music.apple.com")) return "apple-music";
	if (src.includes("soundcloud.com")) return "soundcloud";
	return "youtube";
}

export function embedUrlsToEmbeds(urls: string[]): MusicEmbed[] {
	return urls.map((src, index) => ({
		title: `Embedded media ${index + 1}`,
		src,
		platform: inferPlatform(src),
		...(src.includes("music.apple.com")
			? {
					allow: "encrypted-media *; fullscreen *",
					sandbox:
						"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
				}
			: {}),
		...(src.includes("soundcloud.com")
			? {
					allow: "autoplay; encrypted-media",
				}
			: {}),
	}));
}

export function groupEmbedsByPlatform(embeds: MusicEmbed[]) {
	return {
		appleMusic: embeds.filter((embed) => embed.platform === "apple-music"),
		soundcloud: embeds.filter((embed) => embed.platform === "soundcloud"),
		youtube: embeds.filter((embed) => embed.platform === "youtube"),
	};
}
