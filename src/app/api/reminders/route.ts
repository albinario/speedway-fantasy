import { NextResponse } from 'next/server'

import { sendGpReminders } from '@/lib/reminders'

export async function GET(req: Request) {
	const auth = req.headers.get('authorization')
	if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await sendGpReminders()

	if (!result) {
		return NextResponse.json({ skipped: true, reason: 'No GP today' })
	}

	return NextResponse.json(result)
}
