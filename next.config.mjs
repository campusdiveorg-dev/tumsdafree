/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ESLint issues are style/lint only; do not block the production build.
    // Run `npm run lint` separately to review and address warnings incrementally.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Surface TypeScript errors in the IDE, but don't fail the Vercel build
    // for non-blocking type issues (e.g. implicit any in ported pages).
    // Remove this once all `any` types are resolved.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
