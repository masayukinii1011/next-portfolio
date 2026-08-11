import RouteTransition from "@/app/components/RouteTransition";
import { Play } from "next/font/google";

const PlayFont = Play({
	weight: "700",
	subsets: ["latin"],
	display: "swap",
});

function AnimatedTitle() {
	const letters = "msykn's portfolio".split("");

	return (
		<p
			className={`${PlayFont.className} white-bold tracking-wide select-none text-center text-3xl sm:text-5xl md:text-6xl`}
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

export default function Home() {
	return (
		<RouteTransition>
			<div className="flex min-h-dvh flex-col bg-background text-white px-4">
				<div className="h-14 shrink-0" aria-hidden="true" />
				<div className="flex flex-1 items-center justify-center pb-14">
					<AnimatedTitle />
				</div>
			</div>
		</RouteTransition>
	);
}
