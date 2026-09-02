import { Suspense } from 'react'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header, HeaderShell } from '@/components/Header'
import { getViewer } from '@/lib/auth/get-viewer'

async function OnboardingGuard() {
	const viewer = await getViewer()
	if (viewer.isAuthenticated && !viewer.db?.first_name) redirect('/onboarding')
	return null
}

export async function AppShell({ children }: { children: React.ReactNode }) {
	const h = await headers()
	const pathname = h.get('x-pathname') ?? ''

	if (pathname.startsWith('/onboarding')) {
		return (
			<>
				<HeaderShell />
				<main className="mx-auto w-full max-w-screen-md flex-1 px-0 py-3 sm:px-3">
					{children}
				</main>
			</>
		)
	}

	if (pathname.startsWith('/auth')) {
		return <>{children}</>
	}

	return (
		<>
			<Header />

			<main className="mx-auto w-full max-w-screen-md flex-1 px-0 py-3 sm:px-3">
				<Suspense fallback={null}>
					<OnboardingGuard />
				</Suspense>
				{children}
			</main>

			<Suspense fallback={null}>
				<Footer />
			</Suspense>
		</>
	)
}
