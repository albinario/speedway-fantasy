import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getActivityFeed(gpId?: number, limit = 5) {
	return dataFetch(() => {
		let query = db
			.selectFrom('activity_log')
			.innerJoin('users', 'users.id', 'activity_log.user_id')
			.innerJoin('gps', 'gps.id', 'activity_log.gp_id')
			.innerJoin('cities_with_country', 'cities_with_country.id', 'gps.city_id')
			.select([
				'activity_log.id',
				'activity_log.action',
				'activity_log.created_at',
				'activity_log.user_id',
				'users.first_name',
				'users.last_name',
				'gps.round',
				'cities_with_country.name as city_name',
				'cities_with_country.country_code'
			])
			.orderBy('activity_log.created_at', 'desc')
			.limit(limit)

		if (gpId !== undefined) {
			query = query.where('activity_log.gp_id', '=', gpId)
		}

		return query.execute()
	}, [])
}
