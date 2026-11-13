'use server'

import { adminOnly } from '@/lib/auth/admin-only'
import { db } from '@/lib/db'

export async function addRider(
	formData: FormData
): Promise<{ error?: string }> {
	const denied = await adminOnly()
	if (denied) return denied

	const name = (formData.get('name') as string)?.trim()
	const number = Number(formData.get('number'))
	const countryId = Number(formData.get('country_id'))

	if (!name || !number || !countryId) return { error: 'Missing fields' }

	await db
		.insertInto('riders')
		.values({ name, number, country_id: countryId, active: 1 })
		.execute()

	return {}
}
