import { type ComponentType } from 'react'

import Link from 'next/link'

import { auth0 } from '@/lib/auth/auth0'
import { getRoles } from '@/lib/auth/auth0-claims'

const ProtectedPage = auth0.withPageAuthRequired(
	async function ProtectedPage() {
		const session = await auth0.getSession()
		const user = session?.user
		const roles = getRoles(user as Record<string, unknown> | undefined)

		return (
			<>
				<h1>Protected page</h1>
				<p>Signed in as {user?.name ?? user?.email}.</p>
				<p>Roles: {roles.length ? roles.join(', ') : 'none'}</p>

				<details>
					<summary>Debug session user</summary>
					<pre>{JSON.stringify(user, null, 2)}</pre>
				</details>

				<div style={{ display: 'flex', gap: '1rem' }}>
					<Link href="/">Back home</Link>
					<a href="/auth/logout">Log out</a>
				</div>
			</>
		)
	},
	{ returnTo: '/protected' },
) as ComponentType

export default ProtectedPage
