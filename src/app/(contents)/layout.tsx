export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const year = new Date().getFullYear();

	return (
		<>
			<div className="content-layout max-w-screen-lg mx-auto pt-28 pb-14">
				{children}
			</div>
			<footer className="center h-14 w-full bg-background text-white opacity-90">
				<div>(c) {year} msykn</div>
			</footer>
		</>
	);
}
