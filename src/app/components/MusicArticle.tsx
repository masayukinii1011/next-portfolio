"use client";

import SoundCloudPlaylistCard from "@/app/components/SoundCloudPlaylistCard";
import {
	type MusicEmbed,
	getUnifiedMusicCardBodyHeight,
	getUnifiedMusicCardHeight,
	groupEmbedsByPlatform,
} from "@/data/music-embeds";
import { markdownRemarkPlugins } from "@/lib/markdown";
import type { ReactNode } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
	body?: string;
	embeds: MusicEmbed[];
};

const INITIAL_YOUTUBE_COUNT = 2;

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

function MusicEmbedCard({ embed }: { embed: MusicEmbed }) {
	const isYouTube = embed.platform === "youtube";
	const isAppleMusic = embed.platform === "apple-music";
	const iframeHeight = isAppleMusic
		? getUnifiedMusicCardBodyHeight()
		: isYouTube
			? "100%"
			: 352;
	const cardHeight = isAppleMusic ? getUnifiedMusicCardHeight() : undefined;

	const iframeClassName = isYouTube
		? "absolute inset-0 h-full w-full border-0"
		: "block w-full border-0";

	const iframe = (
		<iframe
			className={iframeClassName}
			src={embed.src}
			title={embed.title}
			loading="lazy"
			width="100%"
			height={iframeHeight}
			{...(embed.allow ? { allow: embed.allow } : {})}
			{...(embed.sandbox ? { sandbox: embed.sandbox } : {})}
			{...(isYouTube
				? {
						allow:
							"accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
						allowFullScreen: true,
					}
				: {})}
		/>
	);

	return (
		<article
			className="overflow-hidden rounded-lg border border-gray bg-white shadow-sm"
			style={cardHeight ? { minHeight: cardHeight } : undefined}
		>
			{embed.platform !== "youtube" && (embed.title || embed.href) ? (
				<header className="flex items-center justify-between gap-3 border-b border-gray/70 bg-slate-50/80 px-4 py-2.5">
					<h3 className="truncate text-sm font-semibold text-foreground">
						{embed.title}
					</h3>
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
			) : null}
			{isYouTube ? (
				<div className="relative aspect-video w-full overflow-hidden">
					{iframe}
				</div>
			) : (
				iframe
			)}
		</article>
	);
}

function MusicSection({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<section className="w-full">
			<h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
			{children}
		</section>
	);
}

function MusicEmbedGrid({ children }: { children: ReactNode }) {
	return (
		<div className="grid items-start gap-5 sm:grid-cols-2">{children}</div>
	);
}

export default function MusicArticle({ body, embeds }: Props) {
	const [showAllVideos, setShowAllVideos] = useState(false);
	const { appleMusic, soundcloud, youtube } = groupEmbedsByPlatform(embeds);
	const visibleYoutube = showAllVideos
		? youtube
		: youtube.slice(0, INITIAL_YOUTUBE_COUNT);
	const hiddenVideoCount = Math.max(0, youtube.length - INITIAL_YOUTUBE_COUNT);

	return (
		<div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
			<div className="text-center">
				{body ? (
					<ReactMarkdown
						remarkPlugins={markdownRemarkPlugins}
						className="markdown mx-auto max-w-prose text-balance"
					>
						{body}
					</ReactMarkdown>
				) : (
					<p className="mx-auto max-w-prose text-sm leading-relaxed text-muted-foreground">
						音楽活動も行なっています。
						<br />
						視聴の際は広告ブロックを無効にして下さい。
					</p>
				)}
			</div>

			{appleMusic.length > 0 ? (
				<MusicSection title="Apple Music">
					<MusicEmbedGrid>
						{appleMusic.map((embed) => (
							<MusicEmbedCard key={embed.src} embed={embed} />
						))}
					</MusicEmbedGrid>
				</MusicSection>
			) : null}

			{soundcloud.length > 0 ? (
				<MusicSection title="SoundCloud">
					<MusicEmbedGrid>
						{soundcloud.map((embed) => (
							<SoundCloudPlaylistCard key={embed.src} embed={embed} />
						))}
					</MusicEmbedGrid>
				</MusicSection>
			) : null}

			{youtube.length > 0 ? (
				<MusicSection title="YouTube">
					<MusicEmbedGrid>
						{visibleYoutube.map((embed) => (
							<MusicEmbedCard key={embed.src} embed={embed} />
						))}
					</MusicEmbedGrid>
					{hiddenVideoCount > 0 ? (
						<div className="mt-5 flex justify-center">
							<button
								type="button"
								onClick={() => setShowAllVideos((prev) => !prev)}
								className="rounded-md border border-gray bg-white px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
							>
								{showAllVideos ? "一部のみ表示" : "さらに表示"}
							</button>
						</div>
					) : null}
				</MusicSection>
			) : null}
		</div>
	);
}
