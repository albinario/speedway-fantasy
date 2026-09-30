'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'

import { notifyAdminNewUser } from '@/lib/admin-notifications'
import { auth0 } from '@/lib/auth/auth0'
import { db } from '@/lib/db'

export async function saveProfile(formData: FormData) {
	const session = await auth0.getSession()
	if (!session?.user?.sub) redirect('/auth/login')

	const firstName = (formData.get('first_name') as string)?.trim()
	const lastName = (formData.get('last_name') as string)?.trim()

	if (!firstName || !lastName) return

	// Name is empty until onboarding completes, so this only matches once
	const registered = await db
		.updateTable('users')
		.set({ first_name: firstName, last_name: lastName })
		.where('auth0_id', '=', session.user.sub)
		.where('first_name', '=', '')
		.returning(['id', 'email', 'first_name', 'last_name'])
		.executeTakeFirst()

	if (registered) {
		after(() => notifyAdminNewUser(registered))
	} else {
		await db
			.updateTable('users')
			.set({ first_name: firstName, last_name: lastName })
			.where('auth0_id', '=', session.user.sub)
			.execute()
	}

	redirect('/')
}
