import { getLatestPostsByCategorySlug } from "@/app/contentful";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Play } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const PlayFont = Play({
	weight: "700",
	subsets: ["latin"],
	display: "swap",
});

function AnimatedTitle() {
	const letters = "msykn's portfolio".split("");

	return (
		<p
			className={`${PlayFont.className} white-bold tracking-wide select-none text-3xl sm:text-5xl md:text-6xl`}
			aria-label="msykn's portfolio"
		>
			{letters.map((letter, i) => {
				const key = letter + i;
				return (
					<span
						key={key}
						className="inline-block home-letter"
						style={{ animationDelay: `${i * 100}ms` }}
						aria-hidden="true"
					>
						{letter}
					</span>
				);
			})}
		</p>
	);
}

export default async function Home() {
	const latestWorks = await getLatestPostsByCategorySlug("works", 3).catch(
		(error) => {
			console.error("Failed to fetch latest works:", error);
			return [];
		},
	);

	return (
		<div className="min-h-screen bg-background text-white">
			<section className="center flex-col px-4 pt-32 pb-16 text-center">
				<AnimatedTitle />
				<p className="mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed">
					フロントエンドから AWS まで対応する
					<br className="hidden sm:inline" />
					フルスタックエンジニア
				</p>
				<p className="mt-4 text-sm sm:text-base text-blue-100">
					React / Next.js / TypeScript / AWS
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-3">
					<Button asChild size="lg" variant="secondary">
						<Link href="/works">Works を見る</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="bg-transparent text-white border-white hover:bg-white/10"
					>
						<Link href="/about">About</Link>
					</Button>
					<Button
						asChild
						size="lg"
						variant="outline"
						className="bg-transparent text-white border-white hover:bg-white/10"
					>
						<Link href="/contact">Contact</Link>
					</Button>
				</div>
			</section>

			{latestWorks.length > 0 && (
				<section className="px-4 pb-16 max-w-screen-lg mx-auto">
					<h2 className="text-2xl font-bold mb-6 text-center">Latest Works</h2>
					<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
						{latestWorks.map((post) => (
							<Card
								key={post.slug}
								className="bg-white text-foreground overflow-hidden transition duration-200 ease-out shadow-lg hover:shadow-2xl"
							>
								<Link href={`/works/${post.slug}`}>
									<CardContent className="p-0">
										{post.image.url && (
											<Image
												src={post.image.url}
												alt={post.image.title || post.title}
												width={400}
												height={267}
												sizes="(max-width: 768px) 100vw, 33vw"
												className="w-full"
											/>
										)}
									</CardContent>
									<CardFooter className="flex flex-col items-center p-4 gap-2">
										<CardTitle className="text-center text-base">
											{post.title}
										</CardTitle>
										{post.techTags.length > 0 && (
											<ul className="flex flex-wrap justify-center gap-1">
												{post.techTags.slice(0, 3).map((tag) => (
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
						))}
					</div>
				</section>
			)}
		</div>
	);
}
