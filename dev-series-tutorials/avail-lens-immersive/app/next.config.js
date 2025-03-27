/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable webpack 5 features
  webpack: (config) => {
    // Support for web workers
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };
    
    // Add support for worker files
    config.module.rules.push({
      test: /\.worker\.ts$/,
      loader: 'worker-loader',
      options: {
        filename: 'static/[hash].worker.js',
        publicPath: '/_next/',
      },
    });
    
    return config;
  },
};

module.exports = nextConfig; 