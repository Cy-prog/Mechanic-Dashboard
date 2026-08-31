/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.externals = [...config.externals, 'bcrypt', 'canvas'];
    return config;
  },
};

export default nextConfig;
