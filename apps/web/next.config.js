/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@prisma/client', 'typesense']
  }
};

module.exports = nextConfig;
