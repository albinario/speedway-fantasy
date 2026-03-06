import { recipe } from '@vanilla-extract/recipes'

import { theme } from '@/styles/theme.css'

export const flex = recipe({
	base: {
		display: 'flex',
	},
	variants: {
		inline: {
			true: { display: 'inline-flex' },
			false: { display: 'flex' },
		},
		direction: {
			row: { flexDirection: 'row' },
			rowReverse: { flexDirection: 'row-reverse' },
			column: { flexDirection: 'column' },
			columnReverse: { flexDirection: 'column-reverse' },
		},
		wrap: {
			nowrap: { flexWrap: 'nowrap' },
			wrap: { flexWrap: 'wrap' },
			wrapReverse: { flexWrap: 'wrap-reverse' },
		},
		justify: {
			start: { justifyContent: 'flex-start' },
			end: { justifyContent: 'flex-end' },
			center: { justifyContent: 'center' },
			between: { justifyContent: 'space-between' },
			around: { justifyContent: 'space-around' },
			evenly: { justifyContent: 'space-evenly' },
		},
		align: {
			start: { alignItems: 'flex-start' },
			end: { alignItems: 'flex-end' },
			center: { alignItems: 'center' },
			baseline: { alignItems: 'baseline' },
			stretch: { alignItems: 'stretch' },
		},
		alignContent: {
			start: { alignContent: 'flex-start' },
			end: { alignContent: 'flex-end' },
			center: { alignContent: 'center' },
			between: { alignContent: 'space-between' },
			around: { alignContent: 'space-around' },
			evenly: { alignContent: 'space-evenly' },
			stretch: { alignContent: 'stretch' },
		},
		gap: {
			none: { gap: '0' },
			xs: { gap: theme.spacing.xs },
			sm: { gap: theme.spacing.sm },
			md: { gap: theme.spacing.md },
			lg: { gap: theme.spacing.lg },
			xl: { gap: theme.spacing.xl },
			xxl: { gap: theme.spacing.xxl },
			xxxl: { gap: theme.spacing.xxxl },
		},
		rowGap: {
			none: { rowGap: '0' },
			xs: { rowGap: theme.spacing.xs },
			sm: { rowGap: theme.spacing.sm },
			md: { rowGap: theme.spacing.md },
			lg: { rowGap: theme.spacing.lg },
			xl: { rowGap: theme.spacing.xl },
			xxl: { rowGap: theme.spacing.xxl },
			xxxl: { rowGap: theme.spacing.xxxl },
		},
		columnGap: {
			none: { columnGap: '0' },
			xs: { columnGap: theme.spacing.xs },
			sm: { columnGap: theme.spacing.sm },
			md: { columnGap: theme.spacing.md },
			lg: { columnGap: theme.spacing.lg },
			xl: { columnGap: theme.spacing.xl },
			xxl: { columnGap: theme.spacing.xxl },
			xxxl: { columnGap: theme.spacing.xxxl },
		},
		grow: {
			0: { flexGrow: 0 },
			1: { flexGrow: 1 },
		},
		shrink: {
			0: { flexShrink: 0 },
			1: { flexShrink: 1 },
		},
		basis: {
			auto: { flexBasis: 'auto' },
			content: { flexBasis: 'content' },
			full: { flexBasis: '100%' },
			half: { flexBasis: '50%' },
			third: { flexBasis: '33.333333%' },
			twoThirds: { flexBasis: '66.666667%' },
			quarter: { flexBasis: '25%' },
			threeQuarters: { flexBasis: '75%' },
		},
		whiteSpace: {
			normal: { whiteSpace: 'normal' },
			nowrap: { whiteSpace: 'nowrap' },
		},
		fullWidth: {
			true: { width: '100%' },
			false: { width: 'auto' },
		},
		// columnToRow: {
		// 	true: {
		// 		flexDirection: 'column',
		// 		'@media': {
		// 			[`screen and (min-width: ${theme.breakpoints.desktopFloor})`]: {
		// 				flexDirection: 'row',
		// 			},
		// 		},
		// 	},
		// 	false: {},
		// },
	},
	defaultVariants: {
		inline: false,
		direction: 'row',
		wrap: 'nowrap',
		justify: 'start',
		align: 'stretch',
		gap: 'none',
		fullWidth: false,
	},
})

export type TFlexVariants = Parameters<typeof flex>[0]

// export const mobileOnly = style({
// 	display: 'block',
// 	'@media': {
// 		[`screen and (min-width: ${theme.breakpoints.desktopFloor})`]: {
// 			display: 'none',
// 			visibility: 'hidden',
// 		},
// 	},
// })

// export const desktopOnly = style({
// 	display: 'none',
// 	visibility: 'hidden',
// 	'@media': {
// 		[`screen and (min-width: ${theme.breakpoints.desktopFloor})`]: {
// 			display: 'block',
// 			visibility: 'visible',
// 		},
// 	},
// })
