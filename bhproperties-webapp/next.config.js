/**@type {import('next').NextConfig} */
const path = require('path');
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  basePath: isProd ? "" : undefined,
	assetPrefix : isProd ? "" : undefined,
  images: {
    loader: "imgix",
    path: "/",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'public/assets/scss')],
    silenceDeprecations: ['legacy-js-api'],
    quietDeps: true, 
  },
};

module.exports = nextConfig;
