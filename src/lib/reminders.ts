'use server'

import { sql } from 'kysely'
import { Resend } from 'resend'

import { adminEmail, colors } from '@/config/brand'

import { db } from './db'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = 'Speedway Fantasy <reminders@speedwayfantasy.com>'
const appUrl = process.env.APP_BASE_URL ?? ''

function emailHtml(body: string) {
	return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111;">${body}<p style="margin-top:32px;font-size:12px;color:#999;">You're receiving this because you have race day reminders enabled on Speedway Fantasy. <a href="${appUrl}">Manage settings</a></p></body></html>`
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

	const heading = `🏁 GP round ${gp.round} in ${gp.city_name} tonight`

	const emails = users.map((user) => {
		const name = user.first_name ?? 'there'
		const hasPicks = pickedUserIds.has(user.id)
		return {
			from,
			to: user.email,
			subject: hasPicks
				? `${heading} — your picks are in`
				: `${heading} — don't forget your picks!`,
			html: hasPicks
				? emailHtml(`
						<h2 style="margin:0 0 16px;">${heading}</h2>
						<p>Hi ${name},</p>
						<p>Your picks are in for tonight's GP in <strong>${gp.city_name}</strong>. If you'd like to make any last-minute changes, now's the time!</p>
						<a href="${appUrl}/gps/${gp.id}" style="display:inline-block;background:${colors.brandRed};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View / update picks →</a>
					`)
				: emailHtml(`
						<h2 style="margin:0 0 16px;">${heading}</h2>
						<p>Hi ${name},</p>
						<p>This is a reminder to pick riders for tonight's GP in <strong>${gp.city_name}</strong>. Don't miss out!</p>
						<a href="${appUrl}/gps/${gp.id}" style="display:inline-block;background:${colors.brandRed};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Pick your riders →</a>
					`)
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
