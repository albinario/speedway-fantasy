'use server'

import { adminOnly } from '@/lib/auth/admin-only'
import { db } from '@/lib/db'

export async function addCountry(
	formData: FormData
): Promise<{ error?: string }> {
	const denied = await adminOnly()
	if (denied) return denied

	const name = (formData.get('name') as string)?.trim()
	const code = (formData.get('code') as string)?.trim().toUpperCase()

	if (!name || !code) return { error: 'Missing fields' }

	await db.insertInto('countries').values({ name, code }).execute()

	return {}
}
