/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webVitalsAttribution: ["CLS", "LCP"]
  },
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
