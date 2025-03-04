/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.cdninstagram.com', // Allow all Instagram CDN subdomains
            pathname: '/**', // Allow all paths
          },
          {
            protocol: 'https',
            hostname: '**.fbcdn.net', // Facebook's image CDN (sometimes used by Instagram)
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
