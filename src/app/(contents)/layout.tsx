export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="content-layout bg-slate-50 max-w-screen-lg mx-auto pt-28 pb-14">
				{children}
			</div>
			<footer className="bg-background opacity-90 text-white w-full h-14 center">
				<div>(c) 2024 msykn</div>
			</footer>
		</>
	);
}
