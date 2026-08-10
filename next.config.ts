import { createMDX } from 'fumadocs-mdx/next'
import type { NextConfig } from 'next'

const withMDX = createMDX()

// Distinct favicon per environment; production keeps the default (no-op).
const ENV_FAVICONS = {
  development: '/favicon.development.ico',
  preview: '/favicon.preview.ico'
} as const

const environment = process.env.VERCEL_ENV ?? process.env.NODE_ENV
const envFavicon = ENV_FAVICONS[environment as keyof typeof ENV_FAVICONS]

const config: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true
  },

  async rewrites() {
    if (!envFavicon) {
      return []
    }

    return {
      beforeFiles: [{ source: '/favicon.ico', destination: envFavicon }],
      afterFiles: [],
      fallback: []
    }
  },

  async redirects() {
    return [
      {
        // Launch redirect: the SWR marketing lander lives at
        // vercel.com/oss/swr; the docs stay here. 307 (permanent: false)
        // during the launch soak, flip to permanent: true (308) once the
        // lander has settled. Do not merge before the `lander-oss-swr`
        // flag is live, or the root will bounce visitors into a 404.
        source: '/',
        destination: 'https://vercel.com/oss/swr',
        permanent: false
      },
      {
        source: '/docs',
        destination: '/docs/getting-started',
        permanent: true
      },
      {
        source: '/:locale/docs',
        destination: '/:locale/docs/getting-started',
        permanent: true
      },
      {
        source: '/blog',
        destination: '/blog/swr-v1',
        permanent: true
      },
      {
        source: '/:locale/blog',
        destination: '/:locale/blog/swr-v1',
        permanent: true
      },
      {
        source: '/examples',
        destination: '/examples/basic',
        permanent: true
      },
      {
        source: '/:locale/examples',
        destination: '/:locale/examples/basic',
        permanent: true
      },

      {
        source: '/fr-FR/:path*',
        destination: '/fr/:path*',
        permanent: true
      },
      {
        source: '/es-ES/:path*',
        destination: '/es/:path*',
        permanent: true
      },
      {
        source: '/pt-BR/:path*',
        destination: '/pt/:path*',
        permanent: true
      },
      {
        source: '/zh-CN/:path*',
        destination: '/cn/:path*',
        permanent: true
      },
      {
        source: '/zh/:path*',
        destination: '/cn/:path*',
        permanent: true
      }
    ]
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.vercel.com'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      }
    ]
  }
}

export default withMDX(config)
