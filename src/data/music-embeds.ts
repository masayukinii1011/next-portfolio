export type MusicEmbed = {
	title: string;
	src: string;
	allow?: string;
	sandbox?: string;
};

export const DEFAULT_MUSIC_EMBEDS: MusicEmbed[] = [
	{
		title: "SoundCloud Playlist 1",
		src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1092547429&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
	},
	{
		title: "SoundCloud Playlist 2",
		src: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/1486647112&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true",
	},
	{
		title: "Apple Music Album 1",
		src: "https://embed.music.apple.com/jp/album/matters-of-the-affection/1536910723",
		allow: "encrypted-media *; fullscreen *",
		sandbox:
			"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
	},
	{
		title: "Apple Music Album 2",
		src: "https://embed.music.apple.com/jp/album/underneath-the-city-of-the-bloom/1334493546",
		allow: "encrypted-media *; fullscreen *",
		sandbox:
			"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
	},
	{
		title: "YouTube Video 1",
		src: "https://www.youtube.com/embed/oDQt5m3BVD8",
	},
	{
		title: "YouTube Video 2",
		src: "https://www.youtube.com/embed/l9yCRuFNKIY",
	},
	{
		title: "YouTube Video 3",
		src: "https://www.youtube.com/embed/2B2w8jNjoF8",
	},
	{
		title: "YouTube Video 4",
		src: "https://www.youtube.com/embed/d1UjjotarFQ",
	},
	{
		title: "YouTube Video 5",
		src: "https://www.youtube.com/embed/f7AZRGglSQw",
	},
	{
		title: "YouTube Video 6",
		src: "https://www.youtube.com/embed/EYCjx8QpWJE",
	},
	{
		title: "YouTube Video 7",
		src: "https://www.youtube.com/embed/gUN3lEoVzr8",
	},
	{
		title: "YouTube Video 8",
		src: "https://www.youtube.com/embed/c54cX6OK050",
	},
];

export function embedUrlsToEmbeds(urls: string[]): MusicEmbed[] {
	return urls.map((src, index) => ({
		title: `Embedded media ${index + 1}`,
		src,
		...(src.includes("music.apple.com")
			? {
					allow: "encrypted-media *; fullscreen *",
					sandbox:
						"allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation",
				}
			: {}),
	}));
}
