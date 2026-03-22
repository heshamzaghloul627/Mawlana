/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === "production" && { output: "export" }),
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  async rewrites() {
    // In dev, proxy /api/* to Cloud Functions directly
    return process.env.NODE_ENV === "production"
      ? []
      : [
          {
            source: "/api/:name*/",
            destination:
              "https://us-east1-thereturn-d3f2e.cloudfunctions.net/:name*",
          },
          {
            source: "/api/:name*",
            destination:
              "https://us-east1-thereturn-d3f2e.cloudfunctions.net/:name*",
          },
        ];
  },
};

export default nextConfig;
