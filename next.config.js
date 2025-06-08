/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for now - it doesn't work well with database connections
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  }
}

module.exports = nextConfig
