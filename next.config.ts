import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	// turbopack: {},
	headers: async () => [
		{
			source: '/manifest.webmanifest',
			headers: [
				{
					key: 'Cache-Control',
					value: 'public, max-age=604800, stale-while-revalidate=86400',
				},
			],
		},
	],
}
