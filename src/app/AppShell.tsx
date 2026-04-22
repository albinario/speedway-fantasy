import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getViewer } from '@/lib/auth/get-viewer'

export async function AppShell({ children }: { children: React.ReactNode }) {
	const h = await headers()
	const pathname = h.get('x-pathname') ?? ''

	const isExempt =
		pathname.startsWith('/onboarding') || pathname.startsWith('/auth')

	const viewer = await getViewer()

	if (!isExempt && viewer.isAuthenticated && !viewer.db?.first_name) {
		redirect('/onboarding')
	}

	return (
		<>
			<Header viewer={viewer} />

			<main className="fluid-container flex-1 px-0 py-3 sm:px-3">
				{children}
			</main>

			<Footer viewerId={viewer.db?.id} />
		</>
	)
}
