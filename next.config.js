

const nextConfig = {
  /* config options here */
  i18n: {
    defaultLocale: 'en',
    locales: ['ar', 'en', "ur"],
    localeDetection: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.vox-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ],
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
