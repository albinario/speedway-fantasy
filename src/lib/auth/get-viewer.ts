import { cache } from 'react'

import { getViewerDb } from '@/app/users/data'

import { auth0 } from './auth0'
import { getRoles } from './auth0-claims'

export const getViewer = cache(async () => {
	const session = await auth0.getSession()
	const user = session?.user

	if (!user?.sub) return { isAuthenticated: false, isAdmin: false }

	const db = await getViewerDb(user.sub)
	const roles = getRoles(user as Record<string, unknown>)
	const isAdmin = roles.includes('admin')

	return { db, isAuthenticated: true, isAdmin }
})
