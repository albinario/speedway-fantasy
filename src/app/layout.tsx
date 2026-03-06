import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Header } from '@/components/Header'
import { Nav } from '@/components/Nav'
import { metaData } from '@/config/brand'
import '@/styles/globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: metaData.title,
	description: metaData.description,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable}`}>
				<Header />
				<main>{children}</main>
				<Nav />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
