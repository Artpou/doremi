import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: import.meta.env?.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@workspace/ui"],
  logging: {
    debug: import.meta.env?.NODE_ENV === "development",
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
