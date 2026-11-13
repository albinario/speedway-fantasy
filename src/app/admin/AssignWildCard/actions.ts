'use server'

import { adminOnly } from '@/lib/auth/admin-only'
import { db } from '@/lib/db'

export async function assignWildCard(
	formData: FormData
): Promise<{ error?: string }> {
	const denied = await adminOnly()
	if (denied) return denied

	const gpId = Number(formData.get('gp_id'))
	const riderId = Number(formData.get('rider_id'))

	if (!gpId || !riderId) return { error: 'Missing fields' }

	await db
		.updateTable('gps')
		.set({ wild_card_id: riderId })
		.where('id', '=', gpId)
		.execute()

	return {}
}
