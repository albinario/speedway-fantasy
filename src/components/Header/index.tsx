import Image from 'next/image'
import Link from 'next/link'

import { DatabaseZap, FlagIcon, LogIn, UserIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

import { HeaderNav } from './Nav'

type THeader = {
	viewer: Awaited<ReturnType<typeof getViewer>>
}

export async function Header({ viewer }: THeader) {
	return (
		<div className="sticky top-0 z-50 flex justify-between border-b bg-black/65 p-3 backdrop-blur-sm">
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

			<div className="flex items-start gap-2">
				{viewer.isAuthenticated ? (
					<>
						<Button asChild variant="outline" size="lg">
							<Link href={`/users/${viewer.db?.id}`}>
								My page <UserIcon />
							</Link>
						</Button>

						{viewer.isAdmin && (
							<>
								<Button asChild variant="outline" size="icon-lg">
									<Link href="/admin">
										<DatabaseZap />
									</Link>
								</Button>

								<Button asChild variant="outline" size="icon-lg">
									<Link href="/admin/report">
										<FlagIcon />
									</Link>
								</Button>
							</>
						)}
					</>
				) : (
					<Button asChild variant="outline">
						<a href="/auth/login">
							Sign in <LogIn />
						</a>
					</Button>
				)}

				<HeaderNav viewerId={viewer.db?.id} />
			</div>
		</div>
	)
}
