import { getTranslations } from 'next-intl/server'

import { PageHeader } from '@/components/PageHeader'
import { getPageMetadata } from '@/i18n/page-metadata'

import { getRidersActive } from './data'
import { RidersActive } from './RidersActive'

export const generateMetadata = () => getPageMetadata('riders')

export default async function RidersPage() {
	const tPages = await getTranslations('Pages')
	const ridersActive = await getRidersActive()

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={tPages('riders.title')} hideYearSelector />
			{ridersActive.length > 0 && <RidersActive riders={ridersActive} />}
		</div>
	)
}
