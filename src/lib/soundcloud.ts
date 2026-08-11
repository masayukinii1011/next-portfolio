import type { MusicEmbed } from "@/data/music-embeds";

export type SoundCloudTrack = {
	id: number;
	title: string;
	duration: number;
	artworkUrl?: string;
};

export function toSoundCloudArtworkUrl(
	url: string,
	size: "small" | "large" = "small",
): string {
	const sizeSuffix = size === "small" ? "-t67x67" : "-t500x500";

	return url
		.replace(/-large(?=\.\w+$)/, sizeSuffix)
		.replace(/-t\d+x\d+(?=\.\w+$)/, sizeSuffix);
}

const SOUNDCLOUD_CLIENT_ID =
	process.env.SOUNDCLOUD_CLIENT_ID ?? "pJ6Fj6roW2KRzWAOwGj6kkQ8VRBJjyBD";

async function fetchSoundCloudTrack(
	trackId: number,
): Promise<SoundCloudTrack | null> {
	const response = await fetch(
		`https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
		{ next: { revalidate: 86400 } },
	);

	if (!response.ok) {
		return null;
	}

	const track = (await response.json()) as {
		id?: number;
		title?: string;
		duration?: number;
		artwork_url?: string | null;
	};

	if (!track.id || !track.title || track.duration == null) {
		return null;
	}

	return {
		id: track.id,
		title: track.title,
		duration: track.duration,
		...(track.artwork_url
			? { artworkUrl: toSoundCloudArtworkUrl(track.artwork_url) }
			: {}),
	};
}

function mapSoundCloudTrack(track: {
	id: number;
	title?: string;
	duration?: number;
	artwork_url?: string | null;
}): SoundCloudTrack | null {
	if (!track.id || !track.title || track.duration == null) {
		return null;
	}

	return {
		id: track.id,
		title: track.title,
		duration: track.duration,
		...(track.artwork_url
			? { artworkUrl: toSoundCloudArtworkUrl(track.artwork_url) }
			: {}),
	};
}

export async function fetchSoundCloudPlaylist(
	playlistId: string,
): Promise<{ tracks: SoundCloudTrack[]; artworkUrl?: string }> {
	const response = await fetch(
		`https://api-v2.soundcloud.com/playlists/${playlistId}?client_id=${SOUNDCLOUD_CLIENT_ID}`,
		{ next: { revalidate: 86400 } },
	);

	if (!response.ok) {
		return { tracks: [] };
	}

	const playlist = (await response.json()) as {
		artwork_url?: string | null;
		tracks?: Array<{
			id: number;
			title?: string;
			duration?: number;
			artwork_url?: string | null;
		}>;
	};

	const rawTracks = playlist.tracks ?? [];

	const resolvedTracks = await Promise.all(
		rawTracks.map(async (track) => {
			const mapped = mapSoundCloudTrack(track);
			if (mapped) {
				return mapped;
			}

			if (!track.id) {
				return null;
			}

			return fetchSoundCloudTrack(track.id);
		}),
	);

	const tracks = resolvedTracks.filter(
		(track): track is SoundCloudTrack => track != null,
	);

	const playlistArtwork =
		playlist.artwork_url ??
		rawTracks.find((track) => track.artwork_url)?.artwork_url;

	return {
		tracks,
		...(playlistArtwork
			? { artworkUrl: toSoundCloudArtworkUrl(playlistArtwork, "large") }
			: {}),
	};
}

export async function fetchSoundCloudPlaylistTracks(
	playlistId: string,
): Promise<SoundCloudTrack[]> {
	const { tracks } = await fetchSoundCloudPlaylist(playlistId);
	return tracks;
}

export async function enrichMusicEmbeds(
	embeds: MusicEmbed[],
): Promise<MusicEmbed[]> {
	return Promise.all(
		embeds.map(async (embed) => {
			if (
				embed.platform !== "soundcloud" ||
				!embed.playlistId ||
				embed.tracks?.length
			) {
				return embed;
			}

			const { tracks, artworkUrl } = await fetchSoundCloudPlaylist(
				embed.playlistId,
			);
			return {
				...embed,
				tracks,
				trackCount: tracks.length,
				...(artworkUrl ? { artworkUrl } : {}),
			};
		}),
	);
}
