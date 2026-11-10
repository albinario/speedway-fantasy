import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
	headers: async () => [
		{
			source: '/manifest.webmanifest',
			headers: [
				{
					key: 'Cache-Control',
					value: 'public, max-age=604800, stale-while-revalidate=86400'
				}
			]
		}
	]
}

export default withNextIntl(nextConfig)
