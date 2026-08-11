"use client";

import type { MusicEmbed } from "@/data/music-embeds";
import {
	buildSoundCloudPlaylistSrc,
	getUnifiedMusicCardHeight,
	getUnifiedMusicCardTrackListHeight,
	MUSIC_CARD_REFERENCE_TRACK_COUNT,
	SOUNDCLOUD_PLAYER_HEIGHT,
} from "@/data/music-embeds";
import { useEffect, useId, useRef, useState } from "react";

type SoundCloudWidget = {
	bind: (event: string, listener: () => void) => void;
	play: () => void;
	skip: (index: number) => void;
};

declare global {
	interface Window {
		SC?: {
			Widget: new (iframe: HTMLIFrameElement) => SoundCloudWidget;
		};
	}
}

function loadSoundCloudApi(): Promise<void> {
	if (window.SC) {
		return Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>(
			'script[data-soundcloud-api="true"]',
		);

		if (existing) {
			if (window.SC) {
				resolve();
				return;
			}

			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener("error", () => reject(), { once: true });
			return;
		}

		const script = document.createElement("script");
		script.src = "https://w.soundcloud.com/player/api.js";
		script.dataset.soundcloudApi = "true";
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load SoundCloud API"));
		document.body.appendChild(script);
	});
}

function formatDuration(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function ExternalLinkIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-3.5 shrink-0 opacity-60"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			strokeWidth={2}
		>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
			/>
		</svg>
	);
}

type Props = {
	embed: MusicEmbed;
};

export default function SoundCloudPlaylistCard({ embed }: Props) {
	const listId = useId();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const widgetRef = useRef<SoundCloudWidget | null>(null);
	const [activeIndex, setActiveIndex] = useState(0);
	const [isReady, setIsReady] = useState(false);

	const tracks = embed.tracks ?? [];
	const trackListHeight = getUnifiedMusicCardTrackListHeight();
	const hasScrollableTracks =
		tracks.length > MUSIC_CARD_REFERENCE_TRACK_COUNT;
	const playlistId = embed.playlistId;
	const playerSrc = playlistId ? buildSoundCloudPlaylistSrc(playlistId) : embed.src;

	useEffect(() => {
		if (!iframeRef.current) {
			return;
		}

		let cancelled = false;

		loadSoundCloudApi()
			.then(() => {
				if (cancelled || !iframeRef.current || !window.SC) {
					return;
				}

				const widget = new window.SC.Widget(iframeRef.current);
				widgetRef.current = widget;

				widget.bind("ready", () => {
					if (!cancelled) {
						setIsReady(true);
					}
				});
			})
			.catch(() => {
				if (!cancelled) {
					setIsReady(true);
				}
			});

		return () => {
			cancelled = true;
			widgetRef.current = null;
		};
	}, [playerSrc]);

	const playTrack = (index: number) => {
		const widget = widgetRef.current;
		if (!widget) {
			return;
		}

		setActiveIndex(index);
		widget.skip(index);
		widget.play();
	};

	return (
		<article
			className="overflow-hidden rounded-lg border border-gray bg-white shadow-sm"
			style={{ minHeight: getUnifiedMusicCardHeight() }}
		>
			<header className="flex items-center justify-between gap-3 border-b border-gray/70 bg-slate-50/80 px-4 py-2.5">
				<div className="flex min-w-0 items-center gap-3">
					{embed.artworkUrl ? (
						<img
							src={embed.artworkUrl}
							alt=""
							width={40}
							height={40}
							loading="lazy"
							className="size-10 shrink-0 rounded object-cover"
						/>
					) : null}
					<h3
						id={listId}
						className="truncate text-sm font-semibold text-foreground"
					>
						{embed.title}
					</h3>
				</div>
				{embed.href ? (
					<a
						href={embed.href}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
					>
						<span>Open</span>
						<ExternalLinkIcon />
					</a>
				) : null}
			</header>

			<iframe
				ref={iframeRef}
				className="block w-full border-0"
				src={playerSrc}
				title={embed.title}
				height={String(SOUNDCLOUD_PLAYER_HEIGHT)}
				width="100%"
				allow="autoplay; encrypted-media"
				loading="lazy"
			/>

			<div className="border-t border-gray/70">
				{tracks.length === 0 ? (
					<p className="px-4 py-3 text-sm text-muted-foreground">
						{isReady ? "曲一覧を取得できませんでした。" : "プレイリストを読み込み中…"}
					</p>
				) : (
					<ol
						aria-labelledby={listId}
						className={`divide-y divide-gray/70 ${
							hasScrollableTracks ? "overflow-y-auto" : ""
						}`}
						style={{ height: trackListHeight }}
					>
						{tracks.map((track, index) => {
							const isActive = index === activeIndex;

							return (
								<li key={track.id}>
									<button
										type="button"
										onClick={() => playTrack(index)}
										disabled={!isReady}
										aria-current={isActive ? "true" : undefined}
										className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 disabled:cursor-wait disabled:opacity-70 ${
											isActive ? "bg-slate-50" : ""
										}`}
									>
										<span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
											{index + 1}
										</span>
										{track.artworkUrl ? (
											<img
												src={track.artworkUrl}
												alt=""
												width={32}
												height={32}
												loading="lazy"
												className="size-8 shrink-0 rounded object-cover"
											/>
										) : (
											<span
												aria-hidden="true"
												className="size-8 shrink-0 rounded bg-slate-100"
											/>
										)}
										<span className="min-w-0 flex-1 truncate text-sm text-foreground">
											{track.title}
										</span>
										<span className="shrink-0 text-xs tabular-nums text-muted-foreground">
											{formatDuration(track.duration)}
										</span>
									</button>
								</li>
							);
						})}
					</ol>
				)}
			</div>
		</article>
	);
}
