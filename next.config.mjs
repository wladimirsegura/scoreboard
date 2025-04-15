/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;
