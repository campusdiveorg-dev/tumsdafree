/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint issues are style/lint only; do not block the production build.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2', 'mysql2'],
  },
};

export default nextConfig;
