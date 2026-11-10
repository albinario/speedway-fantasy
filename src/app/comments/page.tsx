import { getPageMetadata } from '@/i18n/page-metadata'
import { getViewer } from '@/lib/auth/get-viewer'

import { CommentsView } from './CommentsView'
import { getComments } from './data'

export const generateMetadata = () => getPageMetadata('comments')

export default async function CommentsPage() {
	const [rawComments, viewer] = await Promise.all([getComments(), getViewer()])

	return (
		<CommentsView
			comments={rawComments}
			viewerId={viewer.db?.id}
			lastReadAt={viewer.db?.comments_last_read_at ?? null}
		/>
	)
}
