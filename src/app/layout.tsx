import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Header } from '@/components/Header'
import { NavFooter } from '@/components/Nav'
import { metaData } from '@/config/brand'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
	display: 'swap'
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
		<html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
			<body className={`${inter.className} flex min-h-screen flex-col`}>
				<Header />
				<main className="container mx-auto my-4 w-full flex-1">{children}</main>
				<NavFooter />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
