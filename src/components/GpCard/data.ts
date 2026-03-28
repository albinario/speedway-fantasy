import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getPicksCount(gpId: number) {
	return dataFetch(
		() =>
			db
				.selectFrom('users_picks')
				.select(db.fn.countAll<number>().as('count'))
				.where('gp_id', '=', gpId)
				.executeTakeFirstOrThrow(),
		{ count: 0 }
	)
}

export async function getPicksRecord() {
	const { record } = await dataFetch(
		() => db.selectFrom('picks_record').selectAll().executeTakeFirstOrThrow(),
		{ record: 0 }
	)
	return { record: Number(record ?? 0) }
}
