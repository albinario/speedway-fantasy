'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'

import { notifyAdminNewUser } from '@/lib/admin-notifications'
import { auth0 } from '@/lib/auth/auth0'
import { db } from '@/lib/db'

// Error is a key in the Onboarding messages, translated by the form
export type TSaveProfileState = {
	error?: 'nameRequired' | 'saveFailed'
}

export async function saveProfile(
	_prevState: TSaveProfileState,
	formData: FormData
): Promise<TSaveProfileState> {
	const session = await auth0.getSession()
	if (!session?.user?.sub) redirect('/auth/login')
	const auth0Id = session.user.sub

	const firstName = (formData.get('first_name') as string)?.trim()
	const lastName = (formData.get('last_name') as string)?.trim()

	if (!firstName || !lastName) return { error: 'nameRequired' }

	let registered
	try {
		// Name is empty until onboarding completes, so this only matches once
		registered = await db
			.updateTable('users')
			.set({ first_name: firstName, last_name: lastName })
			.where('auth0_id', '=', auth0Id)
			.where('first_name', '=', '')
			.returning(['id', 'email', 'first_name', 'last_name'])
			.executeTakeFirst()

		if (!registered) {
			await db
				.updateTable('users')
				.set({ first_name: firstName, last_name: lastName })
				.where('auth0_id', '=', auth0Id)
				.execute()
		}
	} catch (error) {
		console.error(error)
		return { error: 'saveFailed' }
	}

	if (registered) after(() => notifyAdminNewUser(registered))

	// Outside the try: redirect() throws to navigate
	redirect('/')
}
