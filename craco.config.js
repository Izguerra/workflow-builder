const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@styles': path.resolve(__dirname, 'src/styles/'),
    },
    configure: (webpackConfig, { env, paths }) => {
      // Enable more verbose logging
      webpackConfig.stats = 'verbose';
      webpackConfig.infrastructureLogging = {
        level: 'verbose',
      };
      return webpackConfig;
    },
  },
  babel: {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          importSource: '@emotion/react'
        }
      ],
      '@babel/preset-typescript'
    ],
    plugins: ['@emotion/babel-plugin']
  },
  style: {
    css: {
      loaderOptions: {
        sourceMap: true
      }
    }
  }
};
