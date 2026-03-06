import { createGlobalTheme } from '@vanilla-extract/css'

export const theme = createGlobalTheme(':root', {
	palette: {
		backgroundBody: '#0A0A0A',
		backgroundCard: '#1e1e1e',
		border: '#302e2e',
		black: '#000',
		primary: '#C05B41',
		secondary: '#999',
		white: '#fff',
	},

	spacing: {
		xs: '4px',
		sm: '8px',
		md: '16px',
		lg: '24px',
		xl: '48px',
		xxl: '60px',
		xxxl: '120px',
	},

	typography: {
		fontSizeSm: '14px',
		fontSizeBase: '18px',
		fontSizeLg: '32px',
		fontSizeXl: '40px',
		lineHeightTight: '40px',
		lineHeightBase: '32px',
		lineHeightRelaxed: '48px',
		letterSpacingTight: '-1.92px',
		letterSpacingNormal: '-2.4px',
		fontWeightMedium: '500',
		fontWeightSemibold: '600',
	},

	breakpoints: {
		mobileRoof: '767px',
		desktopFloor: '1024px',
	},

	transitions: {
		fast: '0.2s',
	},
})
