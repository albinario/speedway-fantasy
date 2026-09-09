import { NextResponse } from 'next/server'

import { refreshNews } from '@/lib/news'

export async function GET(req: Request) {
	const auth = req.headers.get('authorization')
	if (
		!process.env.CRON_SECRET ||
		auth !== `Bearer ${process.env.CRON_SECRET}`
	) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await refreshNews()

	return NextResponse.json(result)
}
