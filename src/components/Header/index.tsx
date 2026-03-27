import Image from 'next/image'

import { LogIn, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

export async function Header() {
	const viewer = await getViewer()

	return (
		<div className="flex justify-between border-b p-4">
			<div className="w-32 sm:w-48 md:w-64">
				<Image
					alt={logo.alt}
					height={logo.height}
					width={logo.width}
					sizes={logo.widthContainer}
					priority
					src={logo.src}
				/>
			</div>

			<div className="flex flex-col items-end gap-2">
				{viewer.isAuthenticated ? (
					<div className="flex items-center gap-3">
						<span className="text-sm">
							{viewer.db?.first_name} {viewer.db?.last_name}
						</span>

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
