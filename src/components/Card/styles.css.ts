import { style } from '@vanilla-extract/css'

import { theme } from '@/styles/theme.css'

export const card = style({
	backgroundColor: theme.palette.backgroundCard,
	border: `1px solid ${theme.palette.border}`,
	borderRadius: theme.spacing.xs,
	padding: theme.spacing.sm,
	transition: `all ${theme.transitions.fast}`,
})
