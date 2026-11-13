import { Suspense } from 'react'

import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'

import { Beer, DatabaseZap, FlagIcon, LogIn, UserIcon } from 'lucide-react'

import { HeaderTradeButton } from '@/components/MyTeamCard/HeaderTradeButton'
import { Button } from '@/components/ui/button'
import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

import { HeaderNav } from './Nav'

export function HeaderShell({ children }: { children?: React.ReactNode }) {
	return (
		<div
			data-slot="app-header"
			className="sticky top-0 z-50 border-b bg-black/65 p-3 backdrop-blur-sm"
		>
			<div className="mx-auto flex w-full max-w-screen-md items-center justify-between">
				<Link href="/" className="w-32 sm:w-48 md:w-64">
					<Image
						alt={logo.alt}
						height={logo.height}
						width={logo.width}
						priority
						sizes={logo.widthContainer}
						src={logo.src}
					/>
				</Link>

				{children && <div className="flex items-start gap-2">{children}</div>}
			</div>
		</div>
	)
}

export async function Header() {
	const [viewer, t] = await Promise.all([getViewer(), getTranslations('Nav')])

	return (
		<HeaderShell>
			{viewer.isAuthenticated ? (
				<>
					{viewer.isAdmin && (
						<>
							<Button asChild size="icon-lg" variant="outline">
								<Link href="/admin">
									<DatabaseZap />
								</Link>
							</Button>

							<Button asChild size="icon-lg" variant="outline">
								<Link href="/admin/report">
									<FlagIcon />
								</Link>
							</Button>
						</>
					)}

					<Button
						asChild
						size="lg"
						variant="outline"
						className="max-sm:w-9 max-sm:px-0"
					>
						<Link href={`/users/${viewer.db?.id}`} aria-label={t('myPage')}>
							<span className="max-sm:sr-only">{t('myPage')}</span>
							<UserIcon />
						</Link>
					</Button>
				</>
			) : (
				<Button asChild size="lg" variant="outline">
					<a href="/auth/login">
						{t('signIn')} <LogIn />
					</a>
				</Button>
			)}

			{viewer.db?.id && (
				<Suspense fallback={null}>
					<HeaderTradeButton viewerId={viewer.db.id} />
				</Suspense>
			)}

			{!viewer.isAdmin && (
				<Button asChild size="icon-lg" variant="outline">
					<Link href="/beer">
						<Beer />
					</Link>
				</Button>
			)}

			<HeaderNav viewerId={viewer.db?.id} reminder={viewer.db?.reminder} />
		</HeaderShell>
	)
}
