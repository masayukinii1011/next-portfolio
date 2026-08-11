import Image, { type ImageProps } from "next/image";
import { ViewTransition } from "react";

type Props = Omit<ImageProps, "alt"> & {
	slug: string;
	alt: string;
};

export default function WorkImageMorph({
	slug,
	alt,
	className,
	...props
}: Props) {
	return (
		<ViewTransition name={`work-${slug}`} share="morph" default="none">
			<Image alt={alt} className={className} {...props} />
		</ViewTransition>
	);
}
