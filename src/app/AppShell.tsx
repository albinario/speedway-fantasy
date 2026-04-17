import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Header } from '@/components/Header'
import { NavFooter } from '@/components/Nav'
import { getViewer } from '@/lib/auth/get-viewer'

export async function AppShell({ children }: { children: React.ReactNode }) {
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
		<>
			<Header />
			<main className="fluid-container flex-1 p-0 sm:p-3">{children}</main>
			<NavFooter />
		</>
	)
}
