import { type ComponentType } from 'react'

import { auth0 } from '@/lib/auth/auth0'

import { CorrectForm } from './CorrectForm'
import { getThisYearGps, getThisYearRiders } from './data'

const CorrectPage = auth0.withPageAuthRequired(
	async function CorrectPage() {
		const [gps, riders] = await Promise.all([
			getThisYearGps(),
			getThisYearRiders()
		])

		return (
			<div className="mx-auto w-full max-w-sm p-3">
				<CorrectForm gps={gps} riders={riders} />
			</div>
		)
	},
	{ returnTo: '/admin/correct' }
) as ComponentType

export default CorrectPage
