import type { NextConfig } from "next";
import { i18n } from "./i18n.config";

const nextConfig: NextConfig = {
  i18n,
  reactStrictMode: true,
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
