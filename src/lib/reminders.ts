'use server'

import { sql } from 'kysely'

import { adminEmail } from '@/config/brand'

import { db } from './db'
import { appUrl, escapeHtml, fromAddress as from, resend } from './email'
import { ctaStyle, emailHtml, getEmailTranslator } from './email-templates'

export async function sendGpReminders(): Promise<{
	sent: number
	gpName: string
} | null> {
	const todayStr = new Date().toISOString().split('T')[0]

	const gp = await db
		.selectFrom('gps')
		.innerJoin('cities', 'cities.id', 'gps.city_id')
		.select(['gps.id', 'gps.round', 'cities.name as city_name'])
		.where(sql<boolean>`DATE(gps.start_date) = ${todayStr}`)
		.where(sql<boolean>`gps.finished IS NOT TRUE`)
		.executeTakeFirst()

	if (!gp) return null

	const [users, picks] = await Promise.all([
		db
			.selectFrom('users')
			.select(['id', 'first_name', 'email', 'locale'])
			.where('reminder', '=', true)
			.execute(),
		db
			.selectFrom('users_picks')
			.select('user_id')
			.where('gp_id', '=', gp.id)
			.execute()
	])

	const pickedUserIds = new Set(picks.map((p) => p.user_id))

	const city = escapeHtml(gp.city_name)

	const emails = users.map((user) => {
		const t = getEmailTranslator(user.locale)
		const hasPicks = pickedUserIds.has(user.id)
		const heading = t('heading', { round: gp.round, city: gp.city_name })
		const greeting = user.first_name
			? t('greeting', { name: escapeHtml(user.first_name) })
			: t('greetingNoName')
		const strong = (chunks: string) => `<strong>${chunks}</strong>`
		const body = hasPicks
			? t.markup('bodyPicked', { city, strong })
			: t.markup('bodyNotPicked', { city, strong })
		const footer = t.markup('footer', {
			link: (chunks) => `<a href="${appUrl}">${chunks}</a>`
		})

		return {
			from,
			to: user.email,
			subject: t(hasPicks ? 'subjectPicked' : 'subjectNotPicked', { heading }),
			html: emailHtml(
				`
					<h2 style="margin:0 0 16px;">${escapeHtml(heading)}</h2>
					<p>${greeting}</p>
					<p>${body}</p>
					<a href="${appUrl}/gps/${gp.id}" style="${ctaStyle}">${t(hasPicks ? 'ctaPicked' : 'ctaNotPicked')}</a>
				`,
				footer
			)
		}
	})

	const sentUpdate = users.filter((u) => pickedUserIds.has(u.id)).length
	const sentPick = users.length - sentUpdate
	let failed = 0

	// Resend batch API: up to 100 emails per request (1 API call vs N)
	const BATCH_SIZE = 100
	for (let i = 0; i < emails.length; i += BATCH_SIZE) {
		const chunk = emails.slice(i, i + BATCH_SIZE)
		try {
			await resend.batch.send(chunk)
		} catch {
			failed += chunk.length
		}
		if (i + BATCH_SIZE < emails.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
	}

	await resend.emails.send({
		from,
		to: adminEmail,
		subject: `${gp.city_name} SGP reminders — ${sentPick + sentUpdate} sent`,
		html: emailHtml(
			`
			<h2 style="margin:0 0 16px;">Reminder summary — ${city} SGP</h2>
			<p>Round: ${gp.round}</p>
			<p>Sent "pick now": <strong>${sentPick}</strong></p>
			<p>Sent "update picks": <strong>${sentUpdate}</strong></p>
			<p>Total: <strong>${sentPick + sentUpdate}</strong></p>
			${failed > 0 ? `<p style="color:#dc2626;">Failed: <strong>${failed}</strong></p>` : ''}
		`,
			getEmailTranslator('en').markup('footer', {
				link: (chunks) => `<a href="${appUrl}">${chunks}</a>`
			})
		)
	})

	return { sent: sentPick + sentUpdate, gpName: gp.city_name }
}
