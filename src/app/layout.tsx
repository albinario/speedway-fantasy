import { Suspense } from 'react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Splash } from '@/components/Splash'
import { Toaster } from '@/components/ui/sonner'
import { metaData } from '@/config/brand'

import { AppShell } from './AppShell'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	preload: false
})

export const metadata: Metadata = {
	title: metaData.title,
	description: metaData.description
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			className="dark"
			style={{ colorScheme: 'dark' }}
			data-scroll-behavior="smooth"
		>
			<body className={`${inter.className} flex min-h-screen flex-col`}>
				<Suspense fallback={<Splash />}>
					<AppShell>{children}</AppShell>
				</Suspense>
				<Toaster />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
