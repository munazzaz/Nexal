/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["scontent-waw2-2.cdninstagram.com",
                "via.placeholder.com",
                'instagram.fmci2-1.fna.fbcdn.net',
                "example.com" // Added here

      ],

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
