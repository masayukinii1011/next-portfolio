export default async function PageTitle({ title }: { title: string }) {
	return (
		<div className="py-8">
			<h2 className="font-bold text-3xl text-center">{title}</h2>
		</div>
	);
}
