/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['@workstreak/shared-timer'],
  typescript: {
    // Skip TypeScript checking during build for now
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint during builds on production
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = nextConfig;