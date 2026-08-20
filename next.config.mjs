// GitHub Pages serves this repo at /artisbay-lite/ (no custom domain), so the
// Pages workflow sets GITHUB_PAGES=true to build with that subpath. The
// HostGator workflow (deploy-artisbay.yml) never sets this, so it keeps
// building as if at root, unaffected — .htaccess serves that from /artisbay/.
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/artisbay-lite' : '';

const nextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false,

  basePath,
  assetPrefix: isGithubPages ? `${basePath}/` : '/',

  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  publicRuntimeConfig: {
    basePath,
  },
};



export default nextConfig;
