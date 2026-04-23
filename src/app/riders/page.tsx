import type { Metadata } from 'next'

import { PageHeader } from '@/components/PageHeader'

import { metaData } from './constants'
import { getRidersActive } from './data'
import { RidersActive } from './RidersActive'

export const metadata: Metadata = metaData

export default async function RidersPage() {
	const ridersActive = await getRidersActive()

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={metaData.title} hideYearSelector />
			{ridersActive.length > 0 && <RidersActive riders={ridersActive} />}
		</div>
	)
}
