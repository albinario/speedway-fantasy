// Source of truth for UI strings. sv.ts is typed against this file, so a key
// added here is a compile error until it's translated there too.
// Grouped by feature; keys inside a group are camelCase.
const en = {
	LocaleSelector: {
		label: 'Language'
	},
	Beer: {
		title: 'Buy me a beer',
		paragraph1:
			'Speedway Fantasy is a passion project - a game that is free to play and always will be. Everyone is welcome!',
		paragraph2:
			'But even though the game is free, it costs quite a bit to run. Servers, domains, development tools and many hours of work are behind what you see.',
		paragraph3:
			'If you enjoy the game and want to show your support, you have the opportunity here to "buy me a beer". A small gesture that means a lot and helps me keep the game alive and continue developing it!',
		paragraph4:
			'Of course this is completely voluntary - the game will always be here regardless. The goal is not to make money, it is to grow the sport. But all support is received with a big thank you!',
		signoff: 'Thanks for playing,\nAlbin',
		card: 'Card'
	},
	Install: {
		title: 'Install app',
		intro:
			'Speedway Fantasy works right from your browser - no App store needed. Add it to your home screen for quick access and a full-screen, app-like experience.',
		ios: {
			step1:
				"Tap the Share icon in Safari's toolbar (the square with an arrow pointing up).",
			step2: 'Scroll down the share menu and tap "Add to Home Screen".',
			step3: 'Tap "Add" in the top-right corner to confirm.'
		},
		android: {
			step1: 'Tap the three-dot menu in the top-right corner of Chrome.',
			step2: 'Tap "Add to Home screen" (sometimes shown as "Install app").',
			step3: 'Tap "Add" or "Install" to confirm.'
		}
	},
	Season2027: {
		heading: 'Big changes coming in <year>2027</year>',
		title:
			'Speedway Fantasy takes the next step — a budget system for building your team.',
		budget: {
			label: 'Budget',
			text: "You'll have 10 coins to spend before each GP."
		},
		riderPicks: {
			label: 'Rider picks',
			text: "You'll still pick three riders, but their combined cost must fit within your budget."
		},
		priceTiers: {
			label: 'Price tiers',
			text: 'Riders are split into five tiers — 5, 4, 3, 2 and 1 coin. The three highest-ranked riders cost 5 coins, the next three cost 4, and so on. The four lowest-ranked riders cost 1 coin.'
		},
		keepTeam: {
			label: 'Keep your team',
			text: "If you don't make any changes, your riders automatically carry over to the next GP."
		},
		transferWindow: {
			label: 'Transfer window',
			text: 'After each GP, prices update and a new transfer window opens. Trade as much as you like until the next GP starts — just like today.'
		},
		lockedPrice: {
			label: 'Locked price',
			text: "The price you pay for a rider is locked in. Even if the rider's value changes later, you'll keep them at the same price."
		},
		privateTrades: {
			label: 'Private trades',
			text: 'Your trades are private until picks lock when the GP starts — just like today.'
		},
		tbdNote:
			'Exactly how the price tiers are calculated is still being worked on and will be clarified before the 2027 season begins.'
	}
}

export type TMessages = typeof en

export default en
