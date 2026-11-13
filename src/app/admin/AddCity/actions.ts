'use server'

import { adminOnly } from '@/lib/auth/admin-only'
import { db } from '@/lib/db'

export async function addCity(formData: FormData): Promise<{ error?: string }> {
	const denied = await adminOnly()
	if (denied) return denied

	const name = (formData.get('name') as string)?.trim()
	const countryId = Number(formData.get('country_id'))

	if (!name || !countryId) return { error: 'Missing fields' }

	await db
		.insertInto('cities')
		.values({ name, country_id: countryId })
		.execute()

	return {}
}
