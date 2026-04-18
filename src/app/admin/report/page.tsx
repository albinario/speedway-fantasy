import { type ComponentType } from 'react'

import { auth0 } from '@/lib/auth/auth0'

import { getActiveGpWithRiders } from './data'
import { ReportForm } from './ReportForm'

const ReportPage = auth0.withPageAuthRequired(
	async function ReportPage() {
		const data = await getActiveGpWithRiders()

		if (!data) {
			return <p className="text-muted-foreground">No active GP found.</p>
		}

		return (
			<ReportForm
				gpId={data.gp.id}
				cityName={data.gp.city_name}
				heatsFinished={data.gp.heats_finished ?? 0}
				riders={data.riders}
			/>
		)
	},
	{ returnTo: '/admin/report' }
) as ComponentType

export default ReportPage
