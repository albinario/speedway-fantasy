import Image from 'next/image'
import Link from 'next/link'

import { DatabaseZap, LogIn } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

import { PickRidersLoader } from './PickRidersLoader'

export async function Header() {
	const viewer = await getViewer()

	return (
		<div className="sticky top-0 z-50 flex justify-between border-b bg-black/65 p-4 backdrop-blur-sm">
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

			<div className="flex flex-col items-end gap-2">
				{viewer.isAuthenticated ? (
					<div className="flex items-center gap-2">
						{viewer.isAdmin && (
							<Button asChild variant="outline" size="icon-lg">
								<Link href="/admin">
									<DatabaseZap />
								</Link>
							</Button>
						)}

						<PickRidersLoader />

						<Button asChild variant="outline" size="lg">
							<Link href={`/users/${viewer.db?.id}`}>My page</Link>
						</Button>
					</div>
				) : (
					<Button asChild variant="outline">
						<a href="/auth/login">
							Sign in <LogIn />
						</a>
					</Button>
				)}

				{/* <Link href="/protected">User protected page</Link> */}
				{/* <Link href="/admin">Admin protected page</Link> */}
			</div>
		</div>
	)
}
