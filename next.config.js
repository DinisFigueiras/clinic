/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel-optimized configuration
  trailingSlash: true,

  // Optimize images for Vercel
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Vercel serverless optimization
  serverExternalPackages: ['@prisma/client', 'prisma'],

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['react-select', 'react-calendar', 'date-fns'],
  },

  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    // Reduce bundle size by excluding unnecessary modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'moment/locale': false, // Exclude moment locales to reduce bundle size
    };

    return config;
  },

  // Prevent favicon conflicts
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/logoclinic.png',
      },
    ];
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Output optimization
  output: 'standalone',
}

module.exports = nextConfig
