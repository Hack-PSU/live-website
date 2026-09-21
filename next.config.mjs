/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "firebasestorage.googleapis.com" },
			{ protocol: "https", hostname: "storage.googleapis.com" },
			{ hostname: "*googleusercontent.com" },
		],
	},
	skipTrailingSlashRedirect: true,
};

export default nextConfig;
