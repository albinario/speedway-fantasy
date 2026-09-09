import { type ComponentType } from 'react'

import { auth0 } from '@/lib/auth/auth0'
import { getViewer } from '@/lib/auth/get-viewer'

import { getPendingNewsItems } from './data'
import { NewsQueue } from './NewsQueue'

const AdminNewsPage = auth0.withPageAuthRequired(
	async function AdminNewsPage() {
		const viewer = await getViewer()
		if (!viewer.isAdmin) {
			return <p className="text-muted-foreground">Forbidden.</p>
		}

		const items = await getPendingNewsItems()

		return <NewsQueue items={items} />
	},
	{ returnTo: '/admin/news' }
) as ComponentType

export default AdminNewsPage
