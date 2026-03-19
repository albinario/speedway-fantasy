import Image from 'next/image'
import Link from 'next/link'

import { logo } from '@/config/brand'
import { getViewer } from '@/lib/auth/get-viewer'

export async function Header() {
	const viewer = await getViewer()

	return (
		<div className="flex justify-between border-b p-4">
			<div className="w-64">
				<Image
					alt={logo.alt}
					height={logo.height}
					width={logo.width}
					priority
					src={logo.src}
				/>
			</div>

			<div className="flex flex-col items-end">
				{viewer.isAuthenticated ? (
					<div>
						{viewer.db?.first_name} {viewer.db?.last_name}{' '}
						<a href="/auth/logout">Log out</a>
					</div>
				) : (
					<a href="/auth/login">Log in</a>
				)}

				<Link href="/protected">User protected page</Link>
				<Link href="/admin">Admin protected page</Link>
			</div>
		</div>
	)
}
