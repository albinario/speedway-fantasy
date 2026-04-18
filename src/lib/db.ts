import { neon } from '@neondatabase/serverless'
import { Kysely } from 'kysely'
import { NeonDialect } from 'kysely-neon'

import type { DB } from '@/types/db'

const isTest = process.env.DB_ENV === 'test'
const databaseUrl = isTest
	? process.env.DATABASE_URL_TEST
	: process.env.DATABASE_URL

if (!databaseUrl) {
	throw new Error(
		isTest
			? 'DATABASE_URL_TEST is not set — create a Neon branch and add it to .env.local'
			: 'DATABASE_URL environment variable is not set'
	)
}

export const db = new Kysely<DB>({
	dialect: new NeonDialect({
		neon: neon(databaseUrl)
	})
})
