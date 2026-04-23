import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://flask-app:80/api/:path*", // ← service name from docker-compose.yml
      },
    ];
  },
};

export default nextConfig;
