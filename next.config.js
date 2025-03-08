

const nextConfig = {
  /* config options here */
  i18n: {
    defaultLocale: 'en',
    locales: ['ar', 'en', "ur"],
    localeDetection: false
  },
  webpack: (config, { isServer }) => {
    // تجاهل تحذير punycode
    config.ignoreWarnings = [
      { module: /node_modules\/punycode/ }
    ];

    return config;
  }
};

export default nextConfig;
