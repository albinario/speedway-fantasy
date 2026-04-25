'use server'

import { updateTag } from 'next/cache'

import { cacheTags } from '@/lib/cache-tags'

export async function revalidateAllAction() {
	Object.values(cacheTags).forEach(updateTag)
}
