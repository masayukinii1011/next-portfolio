import ContactForm from "@/app/components/ContactForm";
import MusicArticle from "@/app/components/MusicArticle";
import PageTitle from "@/app/components/PageTitle";
import PostDetailArticle from "@/app/components/PostDetailArticle";
import { sendMessageApi } from "@/app/sendMessage";

type Props = {
	title: string;
	category: string;
	imageUrl: string;
	imageTitle: string;
	githubUrl: string;
	demoUrl: string;
	body: string;
};

export default function PostDetail({
	title,
	category,
	imageUrl,
	imageTitle,
	githubUrl,
	demoUrl,
	body,
}: Props) {
	return (
		<div className="mx-4 px-8 pb-8 bg-white rounded-lg shadow-lg">
			<PageTitle title={title} />
			{category === "contact" ? (
				<ContactForm sendMessageApi={sendMessageApi} />
			) : category === "music" ? (
				<MusicArticle />
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
