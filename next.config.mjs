/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ['react', 'react-dom', 'zustand', 'sonner'],
    turbo: {
      rules: {
        // Enable turbo for improved build performance
      },
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'files.stripe.com' },
    ],
  },
};

export default nextConfig;
