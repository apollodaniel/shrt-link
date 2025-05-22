import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;
