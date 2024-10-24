import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import Image from "next/image";

type Props = {
	imageUrl: string;
	imageTitle: string;
	githubLink: string;
	demoLink: string;
	body: string;
};

export default async function PostDetailContent({
	imageUrl,
	imageTitle,
	githubLink,
	demoLink,
	body,
}: Props) {
	return (
		<>
			{imageUrl && (
				<div className="center mb-8">
					<Image
						src={imageUrl}
						alt={imageTitle}
						width={640}
						height={360}
						className="border-gray-200 rounded-md"
					/>
				</div>
			)}
			{(githubLink || demoLink) && (
				<div className="center mb-8">
					{githubLink && (
						<a
							href={githubLink}
							target="_blank"
							rel="noopener noreferrer"
							className="border border-gray-200 hover:border-gray-300 rounded-md mx-1"
						>
							<Image
								src="/github_logo.png"
								alt="github"
								width={120}
								height={40}
								className="min-w-28 h-10 inline-block"
							/>
						</a>
					)}
					{demoLink && (
						<a
							href={demoLink}
							target="_blank"
							rel="noopener noreferrer"
							className="border border-gray-200 hover:border-gray-300 rounded-md"
						>
							<span className="min-w-28 h-10 center font-bold">DEMO</span>
						</a>
					)}
				</div>
			)}
			<ReactMarkdown remarkPlugins={[remarkBreaks]} className="markdown">
				{body}
			</ReactMarkdown>
		</>
	);
}
