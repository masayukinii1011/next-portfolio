import PageTitle from "@/app/components/PageTitle";
import PostDetailContent from "@/app/components/PostDetailContent";
import MusicContent from "@/app/components/MusicContent";
import ContactContent from "@/app/components/ContactContent";

type Props = {
	title: string;
	category: string;
	imageUrl: string;
	imageTitle: string;
	githubLink: string;
	demoLink: string;
	body: string;
};

export default async function PostDetail({
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
				<MusicContent />
			) : category === "contact" ? (
				<ContactContent />
			) : (
				<PostDetailContent
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
