import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async redirects() {
		return [
			{
				source: "/api/v1/test/clean",
				destination: `/`,
				permanent: true,
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/api/v1/:path*",
				destination: `${process.env.API_URL}/api/v1/:path*`,
			},
			{
				source: "/:urlid",
				destination: `${process.env.API_URL}/:urlid`,
			},
		];
	},
};

export default nextConfig;
