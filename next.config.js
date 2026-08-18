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
  // Response headers.
  //
  // No full Content-Security-Policy here, deliberately. The App Router streams
  // its payload through inline <script> tags whose contents change per request,
  // so a strict script-src needs a per-request nonce threaded through
  // middleware. That is real work and shipping it untested would break every
  // page, so it is a separate job. `frame-ancestors` is the one CSP directive
  // that inline scripts cannot affect, so it goes in now and covers the
  // clickjacking case the admin panel actually cares about.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
          // Kept alongside frame-ancestors for browsers that predate it.
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // The domain is HTTPS-only behind Cloudflare, so committing to it is safe.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
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
