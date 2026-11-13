import { Pool } from '@neondatabase/serverless'
import {
	Kysely,
	PostgresDialect,
	type PostgresPool,
	type Transaction
} from 'kysely'

import type { DB } from '@/types/db'

import { databaseUrl } from './db'

export type TTransaction = Transaction<DB>

/**
 * Runs fn in a real Postgres transaction: everything commits, or nothing does.
 * The app's HTTP driver (kysely-neon) can't do transactions, so this opens a
 * WebSocket pool for the call and closes it after — safe in serverless.
 */
export async function withTransaction<T>(
	fn: (trx: TTransaction) => Promise<T>
): Promise<T> {
	const db = new Kysely<DB>({
		dialect: new PostgresDialect({
			// Neon's Pool is pg-compatible at runtime; only its typings differ
			pool: new Pool({
				connectionString: databaseUrl,
				max: 1
			}) as unknown as PostgresPool
		})
	})

	try {
		return await db.transaction().execute(fn)
	} finally {
		await db.destroy()
	}
}
