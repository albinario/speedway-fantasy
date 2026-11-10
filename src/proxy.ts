import { NextResponse } from 'next/server'

import { isLocale, localeCookie, localeCookieOptions } from './i18n/config'
import { auth0 } from './lib/auth/auth0'
import { getRoles } from './lib/auth/auth0-claims'

export async function proxy(request: Request) {
	// Legacy ?lang= links (from the old per-page toggles): remember the choice
	// and drop the param, the locale now lives in a cookie
	const url = new URL(request.url)
	const lang = url.searchParams.get('lang')
	if (lang !== null) {
		url.searchParams.delete('lang')
		const redirect = NextResponse.redirect(url)
		if (isLocale(lang)) {
			redirect.cookies.set(localeCookie, lang, localeCookieOptions)
		}
		return redirect
	}

	const authResponse = await auth0.middleware(request)
	const { pathname, search } = url

	// For redirects from auth0 (login/callback/logout), return as-is
	if (authResponse.status !== 200) return authResponse

	if (pathname.startsWith('/protected') || pathname.startsWith('/admin')) {
		const session = await auth0.getSession(
			request as unknown as Parameters<typeof auth0.getSession>[0]
		)

		if (!session) {
			const loginUrl = new URL('/auth/login', request.url)
			loginUrl.searchParams.set('returnTo', `${pathname}${search}`)
			return Response.redirect(loginUrl)
		}

		if (pathname.startsWith('/admin')) {
			const roles = getRoles(
				session.user as Record<string, unknown> | undefined
			)

			if (!roles.includes('admin')) {
				return Response.redirect(new URL('/', request.url))
			}
		}
	}

	// Forward pathname so server components can read it via headers()
	const requestHeaders = new Headers(request.headers)
	requestHeaders.set('x-pathname', pathname)

	const response = NextResponse.next({ request: { headers: requestHeaders } })

	// Copy headers from auth0 response (session cookies etc.)
	authResponse.headers.forEach((value, key) => {
		if (key.toLowerCase() === 'set-cookie') {
			response.headers.append('set-cookie', value)
		} else {
			response.headers.set(key, value)
		}
	})

	return response
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
	]
}
