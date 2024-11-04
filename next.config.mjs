/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "export",
	images: {
		domains: ["images.ctfassets.net"],
		unoptimized: true,
	},
};

export default nextConfig;
