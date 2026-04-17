import {
	Auth0Client,
	filterDefaultIdTokenClaims
} from '@auth0/nextjs-auth0/server'

import { db } from '@/lib/db'

import { getRoles, ROLE_CLAIM } from './auth0-claims'

export const auth0 = new Auth0Client({
	session: {
		rolling: true,
		absoluteDuration: 60 * 60 * 24 * 365 * 10, // 10 years
		inactivityDuration: 60 * 60 * 24 * 365 * 10 // 10 years
	},
	beforeSessionSaved: async (session) => {
		const baseClaims = filterDefaultIdTokenClaims(session.user ?? {})
		const roles = getRoles(session.user as Record<string, unknown> | undefined)

		const sub = session.user?.sub
		const email = session.user?.email
		if (sub && email) {
			await db
				.insertInto('users')
				.values({ auth0_id: sub, email, first_name: '', last_name: '' })
				.onConflict((oc) => oc.column('auth0_id').doNothing())
				.execute()
		}

		return {
			...session,
			user: {
				...baseClaims,
				[ROLE_CLAIM]: roles
			}
		}
	}
})
