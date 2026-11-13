import { adminEmail, colors } from '@/config/brand'

import { db } from './db'
import { appUrl, escapeHtml, fromAddress, resend } from './email'

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
			from: fromAddress,
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

// Never throws — the message is already saved, so a failed email only logs.
export async function notifyAdminContactMessage(message: {
	id: number
	message: string
	user: { id: number; email: string; first_name: string; last_name: string }
}) {
	try {
		const name = `${message.user.first_name} ${message.user.last_name}`

		const { error } = await resend.emails.send({
			from: fromAddress,
			to: adminEmail,
			replyTo: message.user.email,
			subject: `Contact message from ${name}`,
			html: `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111;">
				<h2 style="margin:0 0 16px;">✉️ Contact message</h2>
				<p style="white-space:pre-wrap;">${escapeHtml(message.message)}</p>
				<hr style="border:none;border-top:1px solid #ddd;margin:24px 0;" />
				<p>From: <strong>${escapeHtml(name)}</strong> (${escapeHtml(message.user.email)})</p>
				<p style="color:#666;font-size:13px;">Reply to this email to answer. Message #${message.id}.</p>
				<a href="${appUrl}/users/${message.user.id}" style="display:inline-block;background:${colors.brandRed};color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">View profile →</a>
			</body></html>`
		})

		if (error) console.error(error)
	} catch (error) {
		console.error(error)
	}
}
