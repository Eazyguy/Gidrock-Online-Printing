import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
		agentUpgrade: "security",
	},
	reactCompiler: true,
};

export default nextConfig;
