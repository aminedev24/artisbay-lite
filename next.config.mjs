const nextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false,

  // build as if at root – .htaccess will serve from /artisbay/
  basePath: '',
  assetPrefix: '/',

  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  publicRuntimeConfig: {
    basePath: '',
  },
};



export default nextConfig;
