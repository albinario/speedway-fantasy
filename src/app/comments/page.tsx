import type { Metadata } from 'next'

import { getViewer } from '@/lib/auth/get-viewer'

import { CommentsView } from './CommentsView'
import { metaData } from './constants'
import { getComments } from './data'

export const metadata: Metadata = metaData

export default async function CommentsPage() {
	const [rawComments, viewer] = await Promise.all([getComments(), getViewer()])

	return <CommentsView comments={rawComments} viewerId={viewer.db?.id} />
}
