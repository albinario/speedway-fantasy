import { Suspense } from 'react'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Splash } from '@/components/Splash'
import { SplashRemover } from '@/components/SplashRemover'
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
			<head>
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-2048-2732.jpg"
					media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1668-2388.jpg"
					media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1536-2048.jpg"
					media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1640-2360.jpg"
					media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1668-2224.jpg"
					media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1620-2160.jpg"
					media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1488-2266.jpg"
					media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1320-2868.jpg"
					media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1206-2622.jpg"
					media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1260-2736.jpg"
					media="(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1290-2796.jpg"
					media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1179-2556.jpg"
					media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1170-2532.jpg"
					media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1284-2778.jpg"
					media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1125-2436.jpg"
					media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1242-2688.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-828-1792.jpg"
					media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-1242-2208.jpg"
					media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-750-1334.jpg"
					media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
				<link
					rel="apple-touch-startup-image"
					href="/splash/apple-splash-640-1136.jpg"
					media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
				/>
			</head>

			<body className={`${inter.className} flex min-h-screen flex-col`}>
				{process.env.DB_ENV === 'test' && (
					<div className="fixed top-3 left-3 z-[60] rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-black">
						TEST
					</div>
				)}

				<div
					id="app-splash"
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 9999,
						background: '#0a0a0a',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<img src="/logo.png" alt="Speedway Fantasy" style={{ width: 192 }} />
				</div>
				<SplashRemover />

				<Suspense fallback={<Splash />}>
					<AppShell>{children}</AppShell>
				</Suspense>

				<Toaster position="top-center" />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
