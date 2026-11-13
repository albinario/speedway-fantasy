'use server'

import { updateTag } from 'next/cache'

import { adminOnly } from '@/lib/auth/admin-only'
import { cacheTags } from '@/lib/cache-tags'

export async function revalidateAllAction() {
	const denied = await adminOnly()
	if (denied) return denied

	Object.values(cacheTags).forEach(updateTag)
}
