'use server'

import { redirect } from 'next/navigation'
import { after } from 'next/server'

import { notifyAdminContactMessage } from '@/lib/admin-notifications'
import { getViewer } from '@/lib/auth/get-viewer'
import { db } from '@/lib/db'

import { MESSAGE_MAX, MESSAGE_MIN } from './constants'

// Error is a key in the Contact messages, translated by the form
export type TContactResult = {
	error?: 'messageTooShort' | 'tooLong' | 'sendFailed'
}

export async function sendContactMessage(
	formData: FormData
): Promise<TContactResult> {
	const viewer = await getViewer()
	if (!viewer.isAuthenticated || !viewer.db) redirect('/auth/login')
	const user = viewer.db

	const message = String(formData.get('message') ?? '').trim()

	if (message.length < MESSAGE_MIN) return { error: 'messageTooShort' }
	if (message.length > MESSAGE_MAX) return { error: 'tooLong' }

	let id
	try {
		;({ id } = await db
			.insertInto('contact_messages')
			.values({ user_id: user.id, message })
			.returning('id')
			.executeTakeFirstOrThrow())
	} catch (error) {
		console.error(error)
		return { error: 'sendFailed' }
	}

	// Saved to the DB first; the email goes out after the response
	after(() =>
		notifyAdminContactMessage({
			id,
			message,
			user: {
				id: user.id,
				email: user.email,
				first_name: user.first_name,
				last_name: user.last_name
			}
		})
	)

	return {}
}
