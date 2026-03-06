import { auth0 } from './lib/auth/auth0'
import { getRoles } from './lib/auth/auth0-claims'

export async function proxy(request: Request) {
	const authResponse = await auth0.middleware(request)
	const { pathname, search } = new URL(request.url)

	if (pathname.startsWith('/protected') || pathname.startsWith('/admin')) {
		const session = await auth0.getSession(
			request as unknown as Parameters<typeof auth0.getSession>[0],
		)

		if (!session) {
			const loginUrl = new URL('/auth/login', request.url)
			loginUrl.searchParams.set('returnTo', `${pathname}${search}`)
			return Response.redirect(loginUrl)
		}

		if (pathname.startsWith('/admin')) {
			const roles = getRoles(
				session.user as Record<string, unknown> | undefined,
			)

			const isAdmin = roles.includes('admin')

			if (!isAdmin) {
				return Response.redirect(new URL('/', request.url))
			}
		}
	}

	return authResponse
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
	],
}
