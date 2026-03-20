export const ROLE_CLAIM = 'https://betsgp.local/roles'

export const getRoles = (user?: Record<string, unknown>) => {
	const rawRoles = user?.[ROLE_CLAIM]
	if (!rawRoles) return []

	if (Array.isArray(rawRoles)) {
		return rawRoles.filter((role): role is string => typeof role === 'string')
	}

	return [String(rawRoles)]
}
