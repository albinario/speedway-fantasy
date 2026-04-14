import Image from 'next/image'
import Link from 'next/link'

import { DatabaseZap, LogIn, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

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
						<span className="text-sm">
							{viewer.db?.first_name} {viewer.db?.last_name}
						</span>

						{viewer.isAdmin && (
							<Button asChild variant="outline" size="icon">
								<Link href="/admin">
									<DatabaseZap />
								</Link>
							</Button>
						)}

						<Button asChild variant="outline">
							<a href="/auth/logout">
								Log out <LogOut />
							</a>
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
