import type { Metadata } from 'next'

import { getViewer } from '@/lib/auth/get-viewer'

import { CommentsView } from './CommentsView'
import { metaData } from './constants'
import { getComments } from './data'

export const metadata: Metadata = metaData

export default async function CommentsPage() {
	const [rawComments, viewer] = await Promise.all([getComments(), getViewer()])

	const comments = rawComments.map((c) => ({
		...c,
		created_at: c.created_at.toISOString(),
	}))

	return <CommentsView comments={comments} viewerId={viewer.db?.id} />
}
