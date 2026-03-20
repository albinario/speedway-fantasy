import { dataFetch } from '@/lib/data-fetch'
import { db } from '@/lib/db'

export function getRidersPoints() {
	return dataFetch(
		() =>
			db
				.selectFrom('riders')
				.innerJoin('riders_results', 'riders_results.rider_id', 'riders.id')
				.select((eb) => [
					'riders.id',
					'riders.name',
					eb.fn.sum<number>('riders_results.points').as('total_points'),
				])
				.groupBy(['riders.id', 'riders.name'])
				.orderBy('total_points', 'desc')
				.execute(),
		[],
	)
}
