import { Suspense } from 'react'

import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { AppleTouchLinks } from '@/components/AppleTouchLinks'
import { Splash } from '@/components/Splash'
import { TestBadge } from '@/components/TestBadge'
import { Toaster } from '@/components/ui/sonner'
import { metaData } from '@/config/brand'
import { clientNamespaces } from '@/i18n/config'
import { cn } from '@/lib/utils'

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

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const [locale, messages] = await Promise.all([getLocale(), getMessages()])
	// Only what client components need; server components read the full set
	const clientMessages = Object.fromEntries(
		clientNamespaces.map((namespace) => [namespace, messages[namespace]])
	)

	return (
		<html
			lang={locale}
			translate="no"
			className="dark notranslate"
			style={{ colorScheme: 'dark' }}
			data-scroll-behavior="smooth"
		>
			<head>
				<meta name="google" content="notranslate" />
				<AppleTouchLinks />
			</head>

			<body className={cn(inter.className, 'flex min-h-screen flex-col')}>
				{process.env.DB_ENV === 'test' && <TestBadge />}

				<NextIntlClientProvider messages={clientMessages}>
					<Suspense fallback={<Splash />}>
						<AppShell>{children}</AppShell>
					</Suspense>
				</NextIntlClientProvider>

				<Toaster position="top-center" />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	)
}
