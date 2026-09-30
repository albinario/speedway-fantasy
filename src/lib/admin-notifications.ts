import { Resend } from 'resend'

import { adminEmail, colors } from '@/config/brand'

import { db } from './db'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = 'Speedway Fantasy <notifications@speedwayfantasy.com>'
const appUrl = process.env.APP_BASE_URL ?? ''

function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

// Never throws — a failed notification must not break onboarding.
export async function notifyAdminNewUser(user: {
	id: number
	email: string
	first_name: string
	last_name: string
}) {
	try {
		const { count } = await db
			.selectFrom('users')
			.select((eb) => eb.fn.countAll<number>().as('count'))
			.where('first_name', '!=', '')
			.executeTakeFirstOrThrow()

		const name = `${user.first_name} ${user.last_name}`

		const { error } = await resend.emails.send({
			from,
			to: adminEmail,
			subject: `New player registered — ${name}`,
			html: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111;">
				<h2 style="margin:0 0 16px;">🎉 New player registered</h2>
				<p>Name: <strong>${escapeHtml(name)}</strong></p>
				<p>Email: <strong>${escapeHtml(user.email)}</strong></p>
				<p>Total players: <strong>${count}</strong></p>
				<a href="${appUrl}/users/${user.id}" style="display:inline-block;background:${colors.brandRed};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View profile →</a>
			</body></html>`
		})

		if (error) console.error(error)
	} catch (error) {
		console.error(error)
	}
}
