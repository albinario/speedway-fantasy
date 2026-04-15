'use server'

import { auth0 } from '@/lib/auth/auth0'
import { db } from '@/lib/db'

export async function toggleReminder(enabled: boolean) {
	const session = await auth0.getSession()
	if (!session?.user?.sub) return

	await db
		.updateTable('users')
		.set({ reminder: enabled })
		.where('auth0_id', '=', session.user.sub)
		.execute()
}
