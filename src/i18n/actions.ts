'use server'

import { cookies } from 'next/headers'

import { auth0 } from '@/lib/auth/auth0'
import { db } from '@/lib/db'

import { isLocale, localeCookie, localeCookieOptions } from './config'

// Setting a cookie in a server action re-renders the current route, so the
// page comes back in the new language without a manual refresh
export async function setLocale(locale: string) {
	if (!isLocale(locale)) return

	const cookieStore = await cookies()
	cookieStore.set(localeCookie, locale, localeCookieOptions)

	const session = await auth0.getSession()
	if (!session?.user?.sub) return

	await db
		.updateTable('users')
		.set({ locale })
		.where('auth0_id', '=', session.user.sub)
		.execute()
}
