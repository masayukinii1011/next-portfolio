import ContactForm from "@/app/components/ContactForm";
import MusicArticle from "@/app/components/MusicArticle";
import PageTitle from "@/app/components/PageTitle";
import PostDetailArticle from "@/app/components/PostDetailArticle";
import { sendMessageApi } from "@/app/sendMessage";
import { DEFAULT_MUSIC_EMBEDS, embedUrlsToEmbeds } from "@/data/music-embeds";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

const GITHUB_URL = "https://github.com/masayukinii1011";

type Props = {
	title: string;
	category: string;
	imageUrl: string;
	imageTitle: string;
	githubUrl: string;
	demoUrl: string;
	body: string;
	embedUrls?: string[];
};

export default function PostDetail({
	title,
	category,
	imageUrl,
	imageTitle,
	githubUrl,
	demoUrl,
	body,
	embedUrls = [],
}: Props) {
	const musicEmbeds =
		embedUrls.length > 0 ? embedUrlsToEmbeds(embedUrls) : DEFAULT_MUSIC_EMBEDS;

	return (
		<div className="mx-4 px-8 pb-8 bg-white rounded-lg shadow-lg">
			<PageTitle title={title} />
			{category === "contact" ? (
				<>
					{body && (
						<ReactMarkdown
							remarkPlugins={[remarkBreaks]}
							className="markdown mb-8"
						>
							{body}
						</ReactMarkdown>
					)}
					<ContactForm sendMessageApi={sendMessageApi} />
					<div className="mt-8 center">
						<a
							href={GITHUB_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="border-gray hover:border-gray-300"
						>
							<Image
								src="/github_logo.png"
								alt="GitHub"
								width={120}
								height={40}
								className="min-w-28 h-10 inline-block"
							/>
						</a>
					</div>
				</>
			) : category === "music" ? (
				<MusicArticle body={body} embeds={musicEmbeds} />
			) : (
				<PostDetailArticle
					imageUrl={imageUrl}
					imageTitle={imageTitle}
					githubUrl={githubUrl}
					demoUrl={demoUrl}
					body={body}
				/>
			)}
		</div>
	);
}
