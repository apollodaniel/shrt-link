import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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
				source: "/:id([a-zA-Z0-9]{7})",

				destination: `${process.env.API_URL}/:id`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	output: "standalone",
	experimental: {
		useCache: true,
	},
};

export default withNextIntl(nextConfig);
