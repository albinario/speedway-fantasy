import { type ComponentType } from 'react'

import Link from 'next/link'

import { ChevronRight, Coins } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import { RevalidateAll } from './RevalidateAll'

const AdminPage = auth0.withPageAuthRequired(
	async function AdminPage() {
		const [cities, countries, gpsWildCard, ridersWildCard] = await Promise.all([
			getCities(),
			getCountries(),
			getGPsWildCard(),
			getRidersWildCard()
		])

		return (
			<div className="columns-1 space-y-6 sm:columns-2 sm:space-y-4 [&>*]:break-inside-avoid">
				<Button asChild size="lg" variant="outline" className="w-full">
					<Link href="/admin/odds">
						<Coins className="size-4 text-yellow-400" />
						Odds &amp; prices
						<ChevronRight className="ml-auto size-4" />
					</Link>
				</Button>

				<AddGP cities={cities} />
				<AssignWildCard gps={gpsWildCard} riders={ridersWildCard} />
				<AddRider countries={countries} />
				<AddCity countries={countries} />
				<AddCountry />
				<RevalidateAll />
			</div>
		)
	},
	{ returnTo: '/admin' }
) as ComponentType

export default AdminPage
