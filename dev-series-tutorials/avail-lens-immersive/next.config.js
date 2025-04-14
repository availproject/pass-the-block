/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Only add these externals in production server build
      config.externals.push('puppeteer-core', '@sparticuz/chromium-min');
    }
    return config;
  },
};

module.exports = nextConfig;
