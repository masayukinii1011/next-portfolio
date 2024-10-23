import { Play } from "next/font/google";

const PlayFont = Play({
	weight: "700",
	subsets: ["latin"],
});

export default function Home() {
	const letters = "msykn's portfolio website".split("");

	return (
		<div className="h-full center bg-blue-500">
			<p
				className={`${PlayFont.className} font-bold tracking-wide select-none cursor-pointer text-2xl sm:text-4xl md:text-5xl text-white`}
			>
				{letters.map((letter, i) => {
					const key = letter + i;
					return (
						<span
							key={key}
							className="home-letter inline-block"
							style={{ animationDelay: `${i * 100}ms` }}
						>
							{letter}
						</span>
					);
				})}
			</p>
		</div>
	);
}
