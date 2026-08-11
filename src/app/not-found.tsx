import Link from "next/link";

export default function NotFound() {
	return (
		<div className="center flex-col h-screen bg-background text-white px-4 text-center">
			<h1 className="text-6xl font-bold mb-4">404</h1>
			<p className="text-lg mb-8">ページが見つかりませんでした。</p>
			<Link
				href="/"
				className="px-6 py-3 bg-white text-background font-bold rounded-md hover:bg-slate-100 transition-colors"
			>
				ホームに戻る
			</Link>
		</div>
	);
}
