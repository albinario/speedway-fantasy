// Source of truth for UI strings. sv.ts is typed against this file, so a key
// added here is a compile error until it's translated there too.
// Grouped by feature; keys inside a group are camelCase.
const en = {
	LocaleSelector: {
		label: 'Language'
	},
	Nav: {
		home: 'Home',
		standings: 'Standings',
		gps: "GP's",
		comments: 'Comments',
		activity: 'Activity',
		hallOfFame: 'Hall of fame',
		rules: 'Rules',
		install: 'Install app',
		beer: 'Beer',
		myPage: 'My page',
		logIn: 'Log in',
		signIn: 'Sign in',
		logOut: 'Log out',
		menuTitle: 'Navigation menu',
		menuDescription: 'Links to the main sections of Speedway Fantasy',
		emailReminder: 'Email reminder',
		developedBy: 'Developed by <link>Albin Lindeborg</link>.',
		designedBy:
			'Designed by <albin>Albin Lindeborg</albin>, <pablo>Pablo Suzarte</pablo> and <alexa>Alexa Raducanu</alexa>.',
		rightsReserved: 'All rights reserved.'
	},
	// Browser tab title + description per page, and the page's error text
	Pages: {
		standings: {
			title: 'Standings',
			description: 'Standings of the current season'
		},
		gps: {
			title: "GP's",
			description: 'Browse and view the GP results'
		},
		gp: {
			title: "GP's",
			description: 'Browse and view the GP results'
		},
		comments: {
			title: 'Comments',
			description: 'Browse and view the comments'
		},
		hallOfFame: {
			title: 'Hall of Fame',
			description: 'Hall of Fame',
			noData: 'No hall of fame data'
		},
		riders: {
			title: 'Riders',
			description: 'Browse and view the rider roster'
		},
		users: {
			title: 'Users',
			description: 'Users'
		},
		rules: {
			title: 'Rules',
			description: 'Rules'
		},
		install: {
			title: 'Install app on home screen',
			description: 'Install Speedway Fantasy on your phone'
		},
		beer: {
			title: 'Buy me a beer',
			description: 'Support Speedway Fantasy'
		},
		activity: {
			title: 'Activity',
			description: 'Latest picks from all players'
		}
	},
	Errors: {
		title: 'Something went wrong',
		description: "We couldn't load this page. Please try again in a moment.",
		tryAgain: 'Try again'
	},
	// Short labels reused across features
	Common: {
		viewAll: 'View all',
		pts: 'pts',
		points: 'Points',
		heats: 'Heats',
		position: 'Position',
		live: 'Live',
		wildCard: 'Wild card',
		tbd: 'TBD',
		round: 'Round {round}',
		gps: "GP's",
		picked: 'Picked',
		total: 'Total',
		players: 'Players',
		riders: 'Riders',
		upcoming: 'Upcoming',
		results: 'Results',
		previousPage: 'Previous page',
		nextPage: 'Next page'
	},
	UserHero: {
		pickedInAllGps: 'Picked in all {count} GPs',
		everyGp: 'Every GP',
		gpStreak: 'GP Streak',
		positions: '{count} pos',
		ptsBehind: '{gap} pts',
		behindLeader: 'behind leader',
		memberSince: 'Member since',
		trophyCollection: 'Trophy collection',
		winner: 'Winner',
		second: 'Second',
		third: 'Third'
	},
	Rules: {
		howItWorks: 'How it works',
		pick: 'Pick three (3) riders in each Grand Prix.',
		collect:
			'Collect the points that your three (3) riders score in each Grand Prix.',
		change:
			'You may change your selected riders as many times as you like, up until the start of each Grand Prix.',
		calculation:
			'All rider points are calculated based on heat points, and not according to the official Grand Prix point structure.',
		qualifyingBonus:
			'The first- and second-placed riders from the qualifying round shall each be awarded three (3) additional points and one (1) additional heat, corresponding to a semi-final win.',
		heatPoints: 'Heat points',
		heatWinner: 'Winner',
		heatSecond: '2nd',
		heatThird: '3rd',
		heatFourth: '4th',
		heatPointsValue: '{points} pts',
		allHeats: 'This includes all qualifying heats, semifinals and final',
		sortingOrder: 'Standings sorting order',
		sortPoints: 'Total Points',
		sortWins: 'GP Wins',
		sortSecond: '2nd places',
		sortThird: '3rd places',
		sortHeats: 'Finished heats'
	},
	Onboarding: {
		title: 'Welcome to Speedway Fantasy',
		description: 'Enter your name to continue.',
		firstName: 'First name',
		lastName: 'Last name',
		submit: 'Save and continue',
		saving: 'Saving…',
		nameRequired: 'Please enter both your first and last name.',
		saveFailed: "Couldn't save your name. Please try again."
	},
	Comments: {
		unknown: 'Unknown',
		reply: 'Reply',
		replyingTo: 'Replying to {name}',
		replyTo: 'Reply to {name}…',
		writeComment: 'Write a comment…',
		signInToComment: 'Sign in to comment'
	},
	// Reminder emails (rendered in each recipient's saved locale)
	Email: {
		heading: '🏁 GP round {round} in {city} tonight',
		subjectPicked: '{heading} — your picks are in',
		subjectNotPicked: "{heading} — don't forget your picks!",
		greeting: 'Hi {name},',
		greetingNoName: 'Hi there,',
		bodyPicked:
			"Your picks are in for tonight's GP in <strong>{city}</strong>. If you'd like to make any last-minute changes, now's the time!",
		bodyNotPicked:
			"This is a reminder to pick riders for tonight's GP in <strong>{city}</strong>. Don't miss out!",
		ctaPicked: 'View / update picks →',
		ctaNotPicked: 'Pick your riders →',
		footer:
			"You're receiving this because you have race day reminders enabled on Speedway Fantasy. <link>Manage settings</link>"
	},
	RiderHero: {
		timesPicked: 'Times picked'
	},
	Standings: {
		formTotal: 'Total',
		formLast2: 'Last 2',
		formLast4: 'Last 4'
	},
	YearSelector: {
		years: 'Years',
		allTime: 'All time',
		reset: 'Reset',
		toCurrentYear: 'to current year'
	},
	Home: {
		welcome: 'Welcome to <accent>Speedway Fantasy</accent>',
		viewRules: 'View rules',
		featurePick: 'Pick 3 riders in each GP',
		featureEarn: 'Earn their heat points',
		featureClimb: 'Climb standings',
		signInToPlay: 'Sign in to play',
		nextGp: 'Next <accent>GP</accent>',
		previousGp: 'Previous <accent>GP</accent>',
		viewGp: 'View GP',
		previousSeason: 'Previous <accent>season</accent>',
		seasonProgress: 'Season progress',
		currentPodium: 'Current <accent>podium</accent>',
		finalPodium: 'Final <accent>podium</accent>',
		viewStandings: 'View standings'
	},
	Countdown: {
		days: 'days',
		hours: 'hrs',
		minutes: 'min',
		seconds: 'sec'
	},
	GpCard: {
		registeredPlayers:
			'{count, plural, one {<num>#</num> registered player} other {<num>#</num> registered players}}',
		whereYouAre: 'Where you are {time}',
		topPlayers: 'Top <accent>{limit}</accent> players',
		topRiders: 'Top <accent>{limit}</accent> riders',
		pickedRiders: 'Picked riders',
		myPickedRiders: 'My picked riders',
		editPicks: 'Edit',
		pickRiders: 'Pick riders',
		pickedBy: 'Picked by'
	},
	PickRiders: {
		title: 'Pick your <accent>3</accent> riders',
		save: 'Save picks',
		saving: 'Saving…',
		saved: 'Picks saved!',
		closed: 'Picks are closed for this event.'
	},
	Activity: {
		picked: 'Picked',
		updated: 'Updated'
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
		card: 'Card',
		swishLogo: 'Swish logo',
		swishQr: 'Swish QR code'
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
