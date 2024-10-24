import ContactForm from "@/app/components/ContactForm";
import MusicArticle from "@/app/components/MusicArticle";
import PageTitle from "@/app/components/PageTitle";
import PostDetailArticle from "@/app/components/PostDetailArticle";

type Props = {
	title: string;
	category: string;
	imageUrl: string;
	imageTitle: string;
	githubLink: string;
	demoLink: string;
	body: string;
};

export default function PostDetail({
	title,
	category,
	imageUrl,
	imageTitle,
	githubLink,
	demoLink,
	body,
}: Props) {
	return (
		<div className="bg-white rounded-lg shadow-lg px-8 pb-8 mx-4">
			<PageTitle title={title} />
			{category === "music" ? (
				<MusicArticle />
			) : category === "contact" ? (
				<ContactForm />
			) : (
				<PostDetailArticle
					imageUrl={imageUrl}
					imageTitle={imageTitle}
					githubLink={githubLink}
					demoLink={demoLink}
					body={body}
				/>
			)}
		</div>
	);
}
