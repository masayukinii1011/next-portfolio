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
	}[];
};

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
										className="w-full rounded-t-md"
									/>
								</CardContent>
								<CardFooter className="center h-24 p-2">
									<CardTitle className="text-center">{post.title}</CardTitle>
								</CardFooter>
							</Link>
						</Card>
					</div>
				))}
			</div>
		</div>
	);
}
