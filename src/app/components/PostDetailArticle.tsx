import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

type Props = {
	imageUrl: string;
	imageTitle: string;
	githubUrl: string;
	demoUrl: string;
	body: string;
};

export default function PostDetailArticle({
	imageUrl,
	imageTitle,
	githubUrl,
	demoUrl,
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
						className="border-gray"
					/>
				</div>
			)}
			{(githubUrl || demoUrl) && (
				<div className="center mb-8">
					{githubUrl && (
						<a
							href={githubUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-1 border-gray hover:border-gray-300"
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
					{demoUrl && (
						<a
							href={demoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-1 border-gray hover:border-gray-300"
						>
							<span className="center h-10 min-w-28 font-bold">DEMO</span>
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
