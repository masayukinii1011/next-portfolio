import PageTitle from "@/app/components/PageTitle";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type Props = {
	category: {
		title: string;
		slug: string;
	};
	posts: {
		title: string;
		slug: string;
		imageUrl: string;
		imageTitle: string;
		publishDate?: string;
		techTags?: string[];
	}[];
};

function formatDate(dateString?: string): string {
	if (!dateString) {
		return "";
	}
	const date = new Date(dateString);
	if (Number.isNaN(date.getTime())) {
		return dateString;
	}
	return date.toLocaleDateString("ja-JP");
}

export default function PostList({ category, posts }: Props) {
	return (
		<div className="mt-minus-10">
			<PageTitle title={category.title} />
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				{posts.map((post) => (
					<div key={post.slug} className="p-2">
						<Card className="w-full transition duration-200 ease-out shadow-lg hover:shadow-2xl">
							<Link href={`/${category.slug}/${post.slug}`}>
								<CardContent className="p-0">
									<Image
										src={post.imageUrl}
										alt={post.imageTitle}
										width={500}
										height={333}
										sizes="(max-width: 768px) 100vw, 50vw"
										className="w-full rounded-t-md"
									/>
								</CardContent>
								<CardFooter className="flex flex-col items-center justify-center h-auto min-h-24 p-4 gap-2">
									<CardTitle className="text-center">{post.title}</CardTitle>
									{post.publishDate && (
										<time
											dateTime={post.publishDate}
											className="text-sm text-muted-foreground"
										>
											{formatDate(post.publishDate)}
										</time>
									)}
									{post.techTags && post.techTags.length > 0 && (
										<ul className="flex flex-wrap justify-center gap-1">
											{post.techTags.map((tag) => (
												<li
													key={tag}
													className="text-xs px-2 py-0.5 bg-slate-100 rounded-full"
												>
													{tag}
												</li>
											))}
										</ul>
									)}
								</CardFooter>
							</Link>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}
