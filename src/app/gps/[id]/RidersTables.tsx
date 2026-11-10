'use client'

import { useTranslations } from 'next-intl'

import { RidersTable } from '@/components/RidersTable'
import { SectionTitle } from '@/components/SectionHeader'

import type { getGpRidersPreview, getGpRidersResults } from './data'

type TGpRidersResultsTable = {
	data: Awaited<ReturnType<typeof getGpRidersResults>>
}

export function GpRidersResultsTable({ data }: TGpRidersResultsTable) {
	const t = useTranslations('Common')

	return (
		<div>
			<SectionTitle>{t('riders')}</SectionTitle>
			<RidersTable
				data={data.map((r) => ({
					riderId: r.rider_id,
					name: r.name,
					countryCode: r.country_code,
					number: r.number,
					medals: r.medal != null ? [r.medal] : undefined,
					points: r.points,
					heats: r.heats,
					timesPicked: r.times_picked ?? 0,
					pickedByViewer: (r.viewer_picked ?? 0) > 0,
					pos: r.pos
				}))}
			/>
		</div>
	)
}

type TGpRidersPreviewTable = {
	data: Awaited<ReturnType<typeof getGpRidersPreview>>
	isBefore?: boolean
}

export function GpRidersPreviewTable({
	data,
	isBefore
}: TGpRidersPreviewTable) {
	const t = useTranslations('Common')

	return (
		<div>
			<SectionTitle>{t('riders')}</SectionTitle>
			<RidersTable
				hidePicked={isBefore}
				data={data.map((r, i) => ({
					riderId: r.rider_id,
					name: r.name,
					countryCode: r.country_code,
					number: r.number,
					medals: r.medals ?? undefined,
					points: Number(r.points),
					heats: Number(r.heats),
					gps: Number(r.gps),
					pickedByViewer: (r.viewer_picked ?? 0) > 0,
					pos: Number(r.gps) > 0 ? i + 1 : null
				}))}
			/>
		</div>
	)
}
