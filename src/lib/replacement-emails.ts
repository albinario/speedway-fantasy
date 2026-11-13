import { adminEmail } from '@/config/brand'

import { db } from './db'
import { appUrl, escapeHtml, fromAddress, resend } from './email'
import { ctaStyle, emailHtml, getEmailTranslator } from './email-templates'

type TReplacementNotice = {
	gpId: number
	/** Riders taken out of the GP's field */
	removedRiderIds: number[]
	/** Riders put into the field in the same save */
	addedRiderIds: number[]
}

/**
 * Emails every player who owns a rider who was taken out of a GP's field,
 * plus a copy to the admin. Owners are looked up in the background: no
 * count or recipient list is returned, logged or stored, so nobody can tell
 * how many players own a rider. Never throws — the field is already saved.
 */
export async function notifyReplacedRiderOwners({
	gpId,
	removedRiderIds,
	addedRiderIds
}: TReplacementNotice): Promise<void> {
	if (!removedRiderIds.length) return

	try {
		const gp = await db
			.selectFrom('gps')
			.innerJoin('cities', 'cities.id', 'gps.city_id')
			.select(['gps.round', 'gps.start_date', 'cities.name as city_name'])
			.where('gps.id', '=', gpId)
			.executeTakeFirstOrThrow()

		const year = new Date(gp.start_date).getFullYear()

		const [riders, owners] = await Promise.all([
			db
				.selectFrom('riders')
				.select(['id', 'name'])
				.where('id', 'in', [...removedRiderIds, ...addedRiderIds])
				.execute(),
			db
				.selectFrom('users_team')
				.innerJoin('users', 'users.id', 'users_team.user_id')
				.select([
					'users_team.rider_id',
					'users.email',
					'users.first_name',
					'users.locale'
				])
				.where('users_team.rider_id', 'in', removedRiderIds)
				.where('users_team.year', '=', year)
				.execute()
		])

		const nameById = new Map(riders.map((r) => [r.id, r.name]))
		// One out, one in: name the replacement. Several at once: leave it out.
		const replacementName =
			removedRiderIds.length === 1 && addedRiderIds.length === 1
				? nameById.get(addedRiderIds[0])
				: undefined

		function buildEmail(
			to: string,
			riderId: number,
			locale: string | null,
			firstName?: string | null
		) {
			const t = getEmailTranslator(locale)
			const rider = escapeHtml(nameById.get(riderId) ?? '')
			const city = escapeHtml(gp.city_name)
			const replacement = replacementName
			const strong = (chunks: string) => `<strong>${chunks}</strong>`
			const greeting = firstName
				? t('greeting', { name: escapeHtml(firstName) })
				: t('greetingNoName')

			return {
				from: fromAddress,
				to,
				subject: t('replacementSubject', {
					rider: nameById.get(riderId) ?? '',
					round: gp.round,
					city: gp.city_name
				}),
				html: emailHtml(
					`
						<p>${greeting}</p>
						<p>${t.markup('replacementBody', { rider, round: gp.round, city, strong })}</p>
						${replacement ? `<p>${t('replacementNewRider', { replacement: escapeHtml(replacement) })}</p>` : ''}
						<a href="${appUrl}" style="${ctaStyle}">${t('replacementCta')}</a>
					`,
					t.markup('replacementFooter', {
						rider,
						link: (chunks) => `<a href="${appUrl}">${chunks}</a>`
					})
				)
			}
		}

		const emails = [
			...owners.map((o) =>
				buildEmail(o.email, o.rider_id, o.locale, o.first_name)
			),
			// Admin copy: the same notice per rider, never who or how many got it
			...removedRiderIds.map((riderId) => buildEmail(adminEmail, riderId, 'en'))
		]

		// Resend batch API: up to 100 emails per request
		for (let i = 0; i < emails.length; i += 100) {
			const { error } = await resend.batch.send(emails.slice(i, i + 100))
			if (error) console.error(error)
		}
	} catch (error) {
		console.error(error)
	}
}
