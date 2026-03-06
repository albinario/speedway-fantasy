import { cache } from 'react'

import { getViewerDb } from '@/app/users/data'

import { auth0 } from './auth0'

export const getViewer = cache(async () => {
	const session = await auth0.getSession()
	const user = session?.user

	if (!user?.sub) return { isAuthenticated: false }

	const db = await getViewerDb(user.sub)

	return { db, isAuthenticated: true }
})
