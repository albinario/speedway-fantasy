import { type ComponentType } from 'react'

import { auth0 } from '@/lib/auth/auth0'

import { getNextOddsGpId, getOddsFormData, getSelectableRiders } from './data'
import { OddsForm } from './OddsForm'

/** Odds for the next upcoming GP only — no other GP can be priced. */
const OddsPage = auth0.withPageAuthRequired(
	async function OddsPage() {
		const gpId = await getNextOddsGpId()

		if (!gpId) {
			return <p className="text-muted-foreground p-3">No upcoming GP.</p>
		}

		const [data, riders] = await Promise.all([
			getOddsFormData(gpId),
			getSelectableRiders()
		])

		if (!data) {
			return <p className="text-muted-foreground p-3">GP not found.</p>
		}

		return <OddsForm key={gpId} data={data} riders={riders} />
	},
	{ returnTo: '/admin/odds' }
) as ComponentType

export default OddsPage
