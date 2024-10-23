export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="bg-slate-50">
				<div className="max-w-screen-lg mx-auto pt-28">{children}</div>
			</div>
			<footer className="bg-blue-500 text-white w-full h-14 center mt-14">
				<div>(c) 2024 msykn</div>
			</footer>
		</>
	);
}
