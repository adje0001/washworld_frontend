//reactStrictMode: false
// In development, React normally runs every component twice to help catch bugs. This disables that — likely to avoid useEffect running twice and making double fetch requests during development
//rewrites(): Any request to /api/* gets forwarded to http://flask-app:80/api/*. flask-app is the Docker service name for the Flask backend. This is used when running the whole stack in Docker — instead of the frontend needing to know the backend's IP, it just calls /api/... and Next.js forwards it to the Flask container
//Locally the .env is used with the public base url set to 127.0.0.1
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://flask-app:80/api/:path*", // service name from docker-compose.yml
      },
    ];
  },
};

export default nextConfig;
