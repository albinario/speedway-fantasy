import { type ComponentType, Fragment } from 'react'

import Link from 'next/link'

import { auth0 } from '@/lib/auth/auth0'
import { getRoles } from '@/lib/auth/auth0-claims'

const AdminPage = auth0.withPageAuthRequired(
	async function AdminPage() {
		const session = await auth0.getSession()
		const user = session?.user
		const roles = getRoles(user as Record<string, unknown> | undefined)

		return (
			<Fragment>
				<h1>Admin page</h1>
				<p>Signed in as {user?.name ?? user?.email}.</p>
				<p>Roles: {roles.length ? roles.join(', ') : 'none'}</p>

				<div style={{ display: 'flex', gap: '1rem' }}>
					<Link href="/">Back home</Link>
					<Link href="/protected">User page</Link>
					<a href="/auth/logout">Log out</a>
				</div>
			</Fragment>
		)
	},
	{ returnTo: '/admin' },
) as ComponentType

export default AdminPage
