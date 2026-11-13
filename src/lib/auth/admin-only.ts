import { getViewer } from './get-viewer'

/**
 * Guard for admin server actions. Server actions are public endpoints, so a
 * signed-in page is not enough: every admin action must call this first.
 *   const denied = await adminOnly()
 *   if (denied) return denied
 */
export async function adminOnly(): Promise<{ error: string } | null> {
	const viewer = await getViewer()
	return viewer.isAdmin ? null : { error: 'Admins only.' }
}
