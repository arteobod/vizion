/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/googlebefbf6c3af6fc6de.html',
        destination: '/api/google-verify',
      },
    ]
  },
}
module.exports = nextConfig
