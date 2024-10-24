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
		<div className="mx-4 px-8 pb-8 bg-white rounded-lg shadow-lg">
			<PageTitle title={title} />
			{category === "contact" ? (
				<ContactForm />
			) : category === "music" ? (
				<MusicArticle />
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
