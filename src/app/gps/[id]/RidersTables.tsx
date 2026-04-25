'use client'

import { RidersTable } from '@/components/RidersTable'
import { SectionTitle } from '@/components/SectionHeader'

import type { getGpRidersPreview, getGpRidersResults } from './data'

type TGpRidersResultsTable = {
	data: Awaited<ReturnType<typeof getGpRidersResults>>
}

export function GpRidersResultsTable({ data }: TGpRidersResultsTable) {
	return (
		<div>
			<SectionTitle>Riders</SectionTitle>
			<RidersTable
				data={data.map((r, i) => ({
					riderId: r.rider_id,
					name: r.name,
					countryCode: r.country_code,
					number: r.number,
					medals: r.medal != null ? [r.medal] : undefined,
					points: r.points,
					heats: r.heats,
					timesPicked: r.times_picked ?? 0,
					pickedByViewer: (r.viewer_picked ?? 0) > 0,
					pos: r.pos === i + 1 ? r.pos : null
				}))}
			/>
		</div>
	)
}

type TGpRidersPreviewTable = {
	data: Awaited<ReturnType<typeof getGpRidersPreview>>
	isBefore?: boolean
}

export function GpRidersPreviewTable({ data, isBefore }: TGpRidersPreviewTable) {
	return (
		<div>
			<SectionTitle>Riders</SectionTitle>
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
					pos: i + 1
				}))}
			/>
		</div>
	)
}
