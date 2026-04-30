'use server'

import { sql } from 'kysely'
import { Resend } from 'resend'

import { db } from './db'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'reminders@speedwayfantasy.com'
const ADMIN_EMAIL = 'albin.lindeborg@gmail.com'
const APP_URL = process.env.APP_BASE_URL ?? ''

function emailHtml(body: string) {
	return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111;">${body}<p style="margin-top:32px;font-size:12px;color:#999;">You're receiving this because you have race day reminders enabled on Speedway Fantasy. <a href="${APP_URL}">Manage settings</a></p></body></html>`
}

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
			.select(['id', 'first_name', 'email'])
			.where('reminder', '=', true)
			.execute(),
		db
			.selectFrom('users_picks')
			.select('user_id')
			.where('gp_id', '=', gp.id)
			.execute()
	])

	const pickedUserIds = new Set(picks.map((p) => p.user_id))

	let sentPick = 0
	let sentUpdate = 0
	let failed = 0

	for (const user of users) {
		const to = user.email
		const heading = `🏁 GP in ${gp.city_name} tonight`
		const name = user.first_name ?? 'there'
		const hasPicks = pickedUserIds.has(user.id)

		try {
			if (hasPicks) {
				await resend.emails.send({
					from: FROM,
					to,
					subject: `${heading} — your picks are in`,
					html: emailHtml(`
						<h2 style="margin:0 0 16px;">${heading}</h2>
						<p>Hi ${name},</p>
						<p>Your picks are in for tonight's GP in <strong>${gp.city_name}</strong>. If you'd like to make any last-minute changes, now's the time!</p>
						<a href="${APP_URL}/gps/${gp.id}" style="display:inline-block;background:#ff3b1f;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View / update picks →</a>
					`)
				})
				sentUpdate++
			} else {
				await resend.emails.send({
					from: FROM,
					to,
					subject: `${heading} — don't forget your picks!`,
					html: emailHtml(`
						<h2 style="margin:0 0 16px;">${heading}</h2>
						<p>Hi ${name},</p>
						<p>This is a reminder to pick riders for tonight's GP in <strong>${gp.city_name}</strong>. Don't miss out!</p>
						<a href="${APP_URL}/gps/${gp.id}" style="display:inline-block;background:#ff3b1f;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Pick your riders →</a>
					`)
				})
				sentPick++
			}
		} catch {
			failed++
		}
	}

	await resend.emails.send({
		from: FROM,
		to: ADMIN_EMAIL,
		subject: `${gp.city_name} SGP reminders — ${sentPick + sentUpdate} sent`,
		html: emailHtml(`
			<h2 style="margin:0 0 16px;">Reminder summary — ${gp.city_name} SGP</h2>
			<p>Round: ${gp.round}</p>
			<p>Sent "pick now": <strong>${sentPick}</strong></p>
			<p>Sent "update picks": <strong>${sentUpdate}</strong></p>
			<p>Total: <strong>${sentPick + sentUpdate}</strong></p>
			${failed > 0 ? `<p style="color:#dc2626;">Failed: <strong>${failed}</strong></p>` : ''}
		`)
	})

	return { sent: sentPick + sentUpdate, gpName: gp.city_name }
}
