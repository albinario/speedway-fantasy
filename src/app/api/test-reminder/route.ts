import { NextResponse } from 'next/server'
import { Resend } from 'resend'

import { db } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: Request) {
	const auth = req.headers.get('authorization')
	if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = await db.selectFrom('users').select(['first_name', 'email']).where('id', '=', 1).executeTakeFirst()

	if (!user) {
		return NextResponse.json({ error: 'User not found' }, { status: 404 })
	}

	await resend.emails.send({
		from: 'reminders@speedwayfantasy.com',
		to: user.email,
		subject: 'Test reminder',
		html: `<p>Hi ${user.first_name ?? 'there'},</p><p>This is a test reminder email. If you're reading this, the cron job and CRON_SECRET are wired up correctly!</p>`
	})

	return NextResponse.json({ ok: true, sentTo: user.email })
}
