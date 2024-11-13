export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="content-layout max-w-screen-lg mx-auto pt-28 pb-14">
				{children}
			</div>
			<footer className="center h-14 w-full bg-background text-white opacity-90">
				<div>(c) 2024 msykn</div>
			</footer>
		</>
	);
}
