// GitHub Pages serves this repo at /meridian-motors/, but the HostGator
// production build (deploy-artisbay.yml) needs root-absolute paths.
// GITHUB_PAGES is set only by the nextjs.yml workflow.
const isGhPages = process.env.GITHUB_PAGES === 'true';
const ghPagesBase = '/meridian-motors';

const nextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false,

  // build as if at root – .htaccess will serve from /artisbay/
  basePath: isGhPages ? ghPagesBase : '',
  assetPrefix: isGhPages ? `${ghPagesBase}/` : '/',

  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  publicRuntimeConfig: {
    basePath: isGhPages ? ghPagesBase : '',
  },
};



export default nextConfig;
