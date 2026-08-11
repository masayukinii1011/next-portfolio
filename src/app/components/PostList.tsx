import PageTitle from "@/app/components/PageTitle";
import WorkImageMorph from "@/app/components/WorkImageMorph";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
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
					<div key={post.slug} className="flex h-full p-2">
						<Card className="flex h-full w-full flex-col transition duration-200 ease-out shadow-lg hover:shadow-2xl">
							<Link
								href={`/${category.slug}/${post.slug}`}
								transitionTypes={["nav-forward"]}
								className="flex h-full flex-col"
							>
								<CardContent className="p-0">
									<div className="aspect-[3/2] overflow-hidden rounded-t-md">
										<WorkImageMorph
											slug={post.slug}
											src={post.imageUrl}
											alt={post.imageTitle}
											width={500}
											height={333}
											sizes="(max-width: 768px) 100vw, 50vw"
											className="h-full w-full object-cover"
										/>
									</div>
								</CardContent>
								<CardFooter className="flex flex-1 flex-col items-center justify-start gap-2 p-4">
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
