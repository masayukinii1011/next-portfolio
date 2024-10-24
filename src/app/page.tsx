import { Play } from "next/font/google";

const PlayFont = Play({
	weight: "700",
	subsets: ["latin"],
});

export default function Home() {
	const letters = "msykn's portfolio website".split("");

	return (
		<div className="center h-screen bg-background">
			<p
				className={`${PlayFont.className} white-bold tracking-wide select-none cursor-pointer text-2xl sm:text-4xl md:text-5xl`}
			>
				{letters.map((letter, i) => {
					const key = letter + i;
					return (
						<span
							key={key}
							className="inline-blockhome-letter"
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
