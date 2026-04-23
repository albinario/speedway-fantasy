import { type ComponentType } from 'react'

import { auth0 } from '@/lib/auth/auth0'

import { AddCity } from './AddCity'
import { AddCountry } from './AddCountry'
import { AddGP } from './AddGP'
import { AddRider } from './AddRider'
import { AssignWildCard } from './AssignWildCard'
import {
	getCities,
	getCountries,
	getGPsWildCard,
	getRidersWildCard
} from './data'

const AdminPage = auth0.withPageAuthRequired(
	async function AdminPage() {
		const [cities, countries, gpsWildCard, ridersWildCard] = await Promise.all([
			getCities(),
			getCountries(),
			getGPsWildCard(),
			getRidersWildCard()
		])

		return (
			<div className="columns-1 space-y-4 sm:columns-2 lg:columns-3 xl:columns-4 [&>*]:break-inside-avoid">
				<AddGP cities={cities} />
				<AssignWildCard gps={gpsWildCard} riders={ridersWildCard} />
				<AddRider countries={countries} />
				<AddCity countries={countries} />
				<AddCountry />
			</div>
		)
	},
	{ returnTo: '/admin' }
) as ComponentType

export default AdminPage
