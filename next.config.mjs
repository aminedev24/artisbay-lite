// GitHub Pages serves this repo at /artisbay-lite/ (no custom domain), so the
// Pages workflow sets GITHUB_PAGES=true to build with that subpath. The
// HostGator workflow (deploy-artisbay.yml) never sets this, so it keeps
// building as if at root, unaffected - .htaccess serves that from /artisbay/.
var isGithubPages = process.env.GITHUB_PAGES === 'true';
var basePath = '';
var assetPrefix = '/';

if (isGithubPages) {
  basePath = '/artisbay-lite';
  assetPrefix = '/artisbay-lite/';
}

var nextConfig = {
  output: 'export',
  productionBrowserSourceMaps: false,

  basePath: basePath,
  assetPrefix: assetPrefix,

  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },

  publicRuntimeConfig: {
    basePath: basePath,
  },
};

export default nextConfig;
