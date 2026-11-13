import { cacheTags } from './cache-tags'
import { cachedQuery } from './cached-query'
import { db } from './db'

/** A player's current team for a season with the locked price paid for each rider. */
export const getTeam = cachedQuery(
	(userId: number, year: number) =>
		db
			.selectFrom('users_team')
			.select(['rider_id', 'coins_paid'])
			.where('user_id', '=', userId)
			.where('year', '=', year)
			.execute(),
	['users-team'],
	{ tags: [cacheTags.picks], fallback: [] }
)

/**
 * The team with rider details, for showing it on upcoming GP cards that have
 * no picks row yet (the row is copied in when the GP's odds are saved).
 */
export const getTeamRiders = cachedQuery(
	async (userId: number, year: number) => {
		const rows = await db
			.selectFrom('users_team')
			.innerJoin('riders_with_country as r', 'r.id', 'users_team.rider_id')
			.select(['r.id', 'r.name', 'r.number', 'r.country_code'])
			.where('users_team.user_id', '=', userId)
			.where('users_team.year', '=', year)
			.orderBy('users_team.coins_paid', 'desc')
			.execute()

		return rows.filter(
			(
				r
			): r is {
				id: number
				name: string
				number: number
				country_code: string | null
			} => r.id != null && r.name != null && r.number != null
		)
	},
	['users-team-riders'],
	{ tags: [cacheTags.picks], fallback: [] }
)
