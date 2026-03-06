import { globalStyle } from '@vanilla-extract/css'

import { theme } from './theme.css'

globalStyle('html', {
	scrollBehavior: 'smooth',
	scrollbarWidth: 'none',
})

globalStyle('body', {
	backgroundColor: theme.palette.backgroundBody,
	color: theme.palette.white,
})

globalStyle('a', {
	color: theme.palette.secondary,
	textDecoration: 'none',
	transition: `color ${theme.transitions.fast}`,
})

globalStyle('a:hover', {
	color: theme.palette.primary,
})

globalStyle('img', {
	height: 'auto',
	width: '100%',
})
