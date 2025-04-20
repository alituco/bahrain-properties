
/**@type {import('next').NextConfig} */
const path = require('path');
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  output: "export",  // Uncomment the following line only for building purposes. By default, this line should remain commented out.
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
  sassOptions: {
    includePaths: [path.join(__dirname, 'public/assets/scss')],
    silenceDeprecations: ['legacy-js-api'],
    quietDeps: true, 
  },
};

module.exports = nextConfig;
