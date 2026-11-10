import { getTranslations } from 'next-intl/server'

import { GpCard } from '@/components/GpCard'
import { PageHeader } from '@/components/PageHeader'
import { SectionTitle } from '@/components/SectionHeader'
import { getPageMetadata } from '@/i18n/page-metadata'
import { groupGps } from '@/lib/group-gps'
import type { TParamValues } from '@/lib/params'
import { getYearValues } from '@/lib/year'

import { getGps } from './data'

type TGpsPage = {
	searchParams: Promise<{
		year?: string | TParamValues
	}>
}

export const generateMetadata = () => getPageMetadata('gps')

export default async function GpsPage({ searchParams }: TGpsPage) {
	const [tPages, tCommon] = await Promise.all([
		getTranslations('Pages'),
		getTranslations('Common')
	])
	const currentYear = new Date().getFullYear()
	const yearValues = await getYearValues(searchParams, currentYear)
	const gps = await getGps(yearValues.activeYear)
	const { upcoming, finished, upNextId } = groupGps(gps)

	return (
		<div className="flex flex-col gap-4">
			<PageHeader title={tPages('gps.title')} defaultYear={currentYear} />

			{[
				{ title: tCommon('upcoming'), items: upcoming },
				{ title: tCommon('results'), items: finished }
			].map(
				({ title, items }) =>
					items.length > 0 && (
						<section key={title} className="flex flex-col gap-1">
							<SectionTitle>{title}</SectionTitle>

							<div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
								{items.map(({ gp, stage }) => (
									<GpCard
										key={gp.id}
										gp={gp}
										isUpNext={gp.id === upNextId}
										linked
										macroStage={stage}
									/>
								))}
							</div>
						</section>
					)
			)}
		</div>
	)
}
