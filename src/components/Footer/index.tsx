import { getUnreadCommentsCount } from './data'
import { NavFooter } from './Nav'

type TFooter = {
	viewerId?: number
}

export async function Footer({ viewerId }: TFooter) {
	const unreadComments = viewerId
		? await getUnreadCommentsCount(viewerId)
		: 0

	return <NavFooter viewerId={viewerId} unreadComments={unreadComments} />
}
