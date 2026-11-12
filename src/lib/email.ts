import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// One sender for every email. Nothing receives mail on the domain, so replies
// are routed with Reply-To where they matter (e.g. contact messages)
export const fromAddress = 'Speedway Fantasy <noreply@speedwayfantasy.com>'

export const appUrl = process.env.APP_BASE_URL ?? ''

export function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}
