import { getViewer } from '@/lib/auth/get-viewer'

import { getUnreadCommentsCount } from './data'
import { NavFooter } from './Nav'

export async function Footer() {
	const viewer = await getViewer()
	const viewerId = viewer.db?.id
	const unreadComments = viewerId ? await getUnreadCommentsCount(viewerId) : 0

	return <NavFooter viewerId={viewerId} unreadComments={unreadComments} />
}
