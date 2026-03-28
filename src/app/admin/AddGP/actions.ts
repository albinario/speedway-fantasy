'use server'

import { fromZonedTime } from 'date-fns-tz'

import { db } from '@/lib/db'

export async function addGP(formData: FormData): Promise<{ error?: string }> {
	const round = Number(formData.get('round'))
	const localDatetime = formData.get('start_date') as string
	const cityId = Number(formData.get('city_id'))

	if (!round || !localDatetime || !cityId) return { error: 'Missing fields' }

	const city = await db
		.selectFrom('cities')
		.select('time_zone')
		.where('id', '=', cityId)
		.executeTakeFirst()

	if (!city) return { error: 'City not found' }

	const startDate = fromZonedTime(localDatetime, city.time_zone)

	await db
		.insertInto('gps')
		.values({ round, start_date: startDate, city_id: cityId })
		.execute()

	return {}
}
