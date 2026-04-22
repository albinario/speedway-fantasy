import { NavFooter } from './Nav'

type TFooter = {
	viewerId?: number
}

export async function Footer({ viewerId }: TFooter) {
	return <NavFooter viewerId={viewerId} />
}
