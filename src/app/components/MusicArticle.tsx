"use client";

import type { MusicEmbed } from "@/data/music-embeds";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Props = {
	body?: string;
	embeds: MusicEmbed[];
};

function MusicIframe({ embed }: { embed: MusicEmbed }) {
	const isYouTube = embed.src.includes("youtube.com");

	return (
		<iframe
			className="mb-8 max-w-full"
			src={embed.src}
			title={embed.title}
			loading="lazy"
			width="640"
			height="360"
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
}

export default function MusicArticle({ body, embeds }: Props) {
	const [showAll, setShowAll] = useState(false);
	const visibleEmbeds = showAll ? embeds : embeds.slice(0, 3);

	return (
		<div className="center flex-col">
			{body ? (
				<ReactMarkdown remarkPlugins={[remarkBreaks]} className="markdown mb-8">
					{body}
				</ReactMarkdown>
			) : (
				<p className="mb-8">
					音楽活動も行なっています。
					<br />
					視聴の際は広告ブロックを無効にして下さい。
				</p>
			)}

			{visibleEmbeds.map((embed) => (
				<MusicIframe key={embed.src} embed={embed} />
			))}

			{embeds.length > 3 && (
				<button
					type="button"
					onClick={() => setShowAll((prev) => !prev)}
					className="mb-8 px-4 py-2 text-sm font-bold border border-gray rounded-md hover:bg-slate-50"
				>
					{showAll ? "一部のみ表示" : `さらに ${embeds.length - 3} 件を表示`}
				</button>
			)}
		</div>
	);
}
