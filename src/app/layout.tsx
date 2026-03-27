import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Header } from '@/components/Header'
import { NavFooter } from '@/components/Nav'
import { metaData } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

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

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const h = await headers()
	const pathname = h.get('x-pathname') ?? ''

	const isExempt =
		pathname.startsWith('/onboarding') || pathname.startsWith('/auth')

	if (!isExempt) {
		const viewer = await getViewer()
		if (viewer.isAuthenticated && !viewer.db?.first_name) {
			redirect('/onboarding')
		}
	}

	return (
		<html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
			<body className={`${inter.className} flex min-h-screen flex-col`}>
				<Header />

				<main className="fluid-container flex-1 p-0 sm:p-4">{children}</main>

				<NavFooter />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
