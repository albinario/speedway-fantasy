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
		comments: 'Chat',
		activity: 'Activity',
		hallOfFame: 'Hall of fame',
		rules: 'Rules',
		install: 'Install app',
		beer: 'Beer',
		contact: 'Contact',
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
			title: 'Chat',
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
		},
		contact: {
			title: 'Contact',
			description: 'Send a message to the Speedway Fantasy admin'
		}
	},
	// Tab title + description for pages about one GP / rider / player
	DetailPages: {
		gp: {
			title: '{city} GP {year}',
			description: 'Results and picks for round {round}, {city} {year}'
		},
		rider: {
			title: '{name}',
			description: '{name} - Speedway GP results and fantasy stats'
		},
		user: {
			title: '{name}',
			description: 'Speedway Fantasy profile for {name}'
		}
	},
	Errors: {
		title: 'Something went wrong',
		description: "This page couldn't be loaded. Please try again in a moment.",
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
		budget:
			'You have 10 coins to build a team of three (3) riders. Your team can never cost more than 10 coins.',
		buy: 'Start the season by buying three (3) riders. You need a full team to score points.',
		collect:
			'Collect the points that your three (3) riders score in each Grand Prix.',
		keepTeam:
			"If you don't make any changes, your team carries over to the next Grand Prix automatically.",
		transferWindow:
			'New prices are usually published the morning after each Grand Prix, and the transfer window opens. Buy/sell riders as often as you like until the next Grand Prix starts.',
		swap: 'Every trade is a swap: you sell one rider and buy another. Your team must fit within 10 coins after every swap.',
		lockedPrice:
			"As long as you don't sell a rider, you keep them at the price you bought them for, even if their market price has changed. Sell them and you get back exactly what you paid.",
		injuries:
			"If one of your riders is replaced because of an injury or for any other reason, you'll get an email. It's up to you to sell the rider and buy another. If you have an injured rider in your team during a GP, you still score points for your other riders.",
		privateTrades:
			'Your trades are private. Other players see your team when the Grand Prix starts.',
		priceTiers: 'Price tiers',
		tierRiders: 'Riders ranked {from}–{to}',
		tierCoins: '{coins, plural, one {# coin} other {# coins}}',
		tierFieldSize: 'Each Grand Prix has 16 riders.',
		tierOdds:
			'Prices are based on the odds for each Grand Prix. The biggest favourites cost the most.',
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
	Contact: {
		title: 'Contact',
		replyInfo: 'Replies are sent to: <strong>{email}</strong>',
		logInInfo: 'Log in to send a message.',
		logIn: 'Log in',
		message: 'Message',
		messagePlaceholder: 'Write your message…',
		submit: 'Send message',
		sending: 'Sending…',
		sentTitle: 'Message sent',
		sentDescription: 'Thanks! A reply will be sent to your email.',
		messageTooShort:
			'Your message is a bit short — please write at least 10 characters.',
		tooLong: 'Your message is too long.',
		sendFailed: "Couldn't send your message. Please try again."
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
			"You're receiving this because you have race day reminders enabled on Speedway Fantasy. <link>Manage settings</link>",
		replacementSubject: '{rider} is out of round {round} in {city}',
		replacementBody:
			'<strong>{rider}</strong> has been replaced in the field for round {round} in {city}. If you keep him, he scores 0 points in that GP. You can trade him until the GP starts.',
		replacementNewRider: '{replacement} takes his place.',
		replacementCta: 'Trade riders →',
		replacementFooter:
			'You receive this email because {rider} is in your team on <link>Speedway Fantasy</link>.'
	},
	VenueHistory: {
		noPreviousResults: 'No previous results at this venue.'
	},
	ResultSummary: {
		bestRider: 'Best rider',
		bestPlayers: '{count, plural, one {Best player} other {Best players}}',
		more: '+{count} more',
		you: 'You'
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
		reset: 'Reset'
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
		seasonYear: 'Season {year}',
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
		pickedBy: 'Picked by'
	},
	MyTeam: {
		title: 'My <accent>team</accent>',
		spent: 'Spent <accent>{spent}</accent> of {budget} coins',
		trade: 'Trade riders',
		buyTeam: 'Pick your team',
		windowClosed: 'Trading opens when new prices are out.'
	},
	PickRiders: {
		budget: 'Spent <accent>{spent}</accent> of {budget} coins',
		title: 'Pick your <accent>3</accent> riders',
		save: 'Save picks',
		saving: 'Saving…',
		saved: 'Picks saved!',
		closed: 'Picks are closed for this event.',
		overBudget: 'Your team must cost {budget} coins or less.',
		pricesChanged:
			'Prices have just changed. Check the new prices and try again.'
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
			'Speedway Fantasy takes the next step — introducing a budget system for building your team.',
		budget: {
			label: 'Budget',
			text: 'Your team of three riders can cost at most 10 coins in total.'
		},
		riderPicks: {
			label: 'Rider picks',
			text: 'You still pick/buy three riders. Start the season by buying all three — you need a full team to score points.'
		},
		priceTiers: {
			label: 'Price tiers',
			text: 'Each GP has 16 riders in five price tiers. The three biggest favourites cost 5 coins, the next three cost 4, and so on down to 1 coin for the last four. Prices are based on the odds for each GP.'
		},
		keepTeam: {
			label: 'Keep your team',
			text: "If you don't make any changes, your riders automatically carry over to the next GP."
		},
		transferWindow: {
			label: 'Transfer window',
			text: 'New prices are usually published the morning after each GP, and the transfer window opens. Buy/sell riders as often as you like until the next GP starts.'
		},
		lockedPrice: {
			label: 'Locked price',
			text: "As long as you don't sell a rider, you keep them at the price you bought them for, even if their market price has changed. Sell them and you get back exactly what you paid."
		},
		injuries: {
			label: 'Injuries',
			text: "If one of your riders is replaced because of an injury or for any other reason, you'll get an email. It's up to you to sell the rider and buy another. If you have an injured rider in your team during a GP, you still score points for your other riders."
		},
		privateTrades: {
			label: 'Private trades',
			text: 'Your trades are private until picks lock when the GP starts — just like today.'
		},
		rulesLink: 'Read all the rules on the <link>rules page</link>.'
	}
}

export type TMessages = typeof en

export default en
