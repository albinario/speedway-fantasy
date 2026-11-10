import type { TMessages } from './en'

const sv: TMessages = {
	LocaleSelector: {
		label: 'Språk'
	},
	Nav: {
		home: 'Hem',
		standings: 'Tabell',
		gps: 'GP',
		comments: 'Kommentarer',
		activity: 'Aktivitet',
		hallOfFame: 'Hall of fame',
		rules: 'Regler',
		install: 'Installera app',
		beer: 'Bärs',
		myPage: 'Min sida',
		logIn: 'Logga in',
		signIn: 'Logga in',
		logOut: 'Logga ut',
		menuTitle: 'Navigeringsmeny',
		menuDescription: 'Länkar till Speedway Fantasys olika delar',
		emailReminder: 'Påminnelse via e-post',
		developedBy: 'Utvecklad av <link>Albin Lindeborg</link>.',
		designedBy:
			'Designad av <albin>Albin Lindeborg</albin>, <pablo>Pablo Suzarte</pablo> och <alexa>Alexa Raducanu</alexa>.',
		rightsReserved: 'Alla rättigheter förbehållna.'
	},
	Pages: {
		standings: {
			title: 'Tabell',
			description: 'Tabellen för innevarande säsong'
		},
		gps: {
			title: 'GP',
			description: 'Bläddra bland och se resultaten från alla GP'
		},
		gp: {
			title: 'GP',
			description: 'Bläddra bland och se resultaten från alla GP'
		},
		comments: {
			title: 'Kommentarer',
			description: 'Läs och bläddra bland kommentarerna'
		},
		hallOfFame: {
			title: 'Hall of Fame',
			description: 'Hall of Fame',
			noData: 'Ingen data i Hall of Fame än'
		},
		riders: {
			title: 'Förare',
			description: 'Bläddra bland förarna'
		},
		users: {
			title: 'Spelare',
			description: 'Spelare'
		},
		rules: {
			title: 'Regler',
			description: 'Regler'
		},
		install: {
			title: 'Installera appen på hemskärmen',
			description: 'Installera Speedway Fantasy på din telefon'
		},
		beer: {
			title: 'Bjud på en bärs',
			description: 'Stöd Speedway Fantasy'
		},
		activity: {
			title: 'Aktivitet',
			description: 'Senaste valen från alla spelare'
		}
	},
	DetailPages: {
		gp: {
			title: '{city} GP {year}',
			description: 'Resultat och val för omgång {round}, {city} {year}'
		},
		rider: {
			title: '{name}',
			description: '{name} – resultat i Speedway GP och fantasystatistik'
		},
		user: {
			title: '{name}',
			description: 'Profil för {name} i Speedway Fantasy'
		}
	},
	Errors: {
		title: 'Något gick fel',
		description: 'Sidan kunde inte laddas. Försök igen om en stund.',
		tryAgain: 'Försök igen'
	},
	Common: {
		viewAll: 'Visa alla',
		pts: 'p',
		points: 'Poäng',
		heats: 'Heat',
		position: 'Placering',
		live: 'Live',
		wildCard: 'Wild card',
		tbd: 'Meddelas',
		round: 'Omgång {round}',
		gps: 'GP',
		picked: 'Vald',
		total: 'Totalt',
		players: 'Spelare',
		riders: 'Förare',
		upcoming: 'Kommande',
		results: 'Resultat',
		previousPage: 'Föregående sida',
		nextPage: 'Nästa sida'
	},
	UserHero: {
		pickedInAllGps: 'Har valt förare i alla {count} GP',
		everyGp: 'Varje GP',
		gpStreak: 'GP i rad',
		positions: '{count} plac.',
		ptsBehind: '{gap} p',
		behindLeader: 'efter ledaren',
		memberSince: 'Medlem sedan',
		trophyCollection: 'Troféer',
		winner: 'Vinnare',
		second: 'Tvåa',
		third: 'Trea'
	},
	Rules: {
		howItWorks: 'Så fungerar det',
		pick: 'Välj tre (3) förare i varje Grand Prix.',
		collect: 'Samla de poäng som dina tre (3) förare tar i varje Grand Prix.',
		change:
			'Du får byta förare hur många gånger du vill, fram till att respektive Grand Prix startar.',
		calculation:
			'Alla förarpoäng räknas på heatpoäng, inte enligt det officiella poängsystemet för Grand Prix.',
		qualifyingBonus:
			'Första- och andraplacerad förare efter kvalomgångarna får vardera tre (3) extra poäng och ett (1) extra heat, motsvarande en semifinalseger.',
		heatPoints: 'Heatpoäng',
		heatWinner: 'Vinnare',
		heatSecond: '2:a',
		heatThird: '3:e',
		heatFourth: '4:e',
		heatPointsValue: '{points} p',
		allHeats: 'Detta gäller alla kvalheat, semifinaler och finalen',
		sortingOrder: 'Sorteringsordning i tabellen',
		sortPoints: 'Totala poäng',
		sortWins: 'GP-segrar',
		sortSecond: 'Andraplatser',
		sortThird: 'Tredjeplatser',
		sortHeats: 'Körda heat'
	},
	Onboarding: {
		title: 'Välkommen till Speedway Fantasy',
		description: 'Ange ditt namn för att fortsätta.',
		firstName: 'Förnamn',
		lastName: 'Efternamn',
		submit: 'Spara och fortsätt',
		saving: 'Sparar…',
		nameRequired: 'Ange både förnamn och efternamn.',
		saveFailed: 'Det gick inte att spara ditt namn. Försök igen.'
	},
	Comments: {
		unknown: 'Okänd',
		reply: 'Svara',
		replyingTo: 'Svarar {name}',
		replyTo: 'Svara {name}…',
		writeComment: 'Skriv en kommentar…',
		signInToComment: 'Logga in för att kommentera'
	},
	Email: {
		heading: '🏁 GP omgång {round} i {city} ikväll',
		subjectPicked: '{heading} — dina val är klara',
		subjectNotPicked: '{heading} — glöm inte dina val!',
		greeting: 'Hej {name},',
		greetingNoName: 'Hej!',
		bodyPicked:
			'Dina val är klara inför kvällens GP i <strong>{city}</strong>. Vill du göra några ändringar i sista minuten är det dags nu!',
		bodyNotPicked:
			'En påminnelse om att välja förare inför kvällens GP i <strong>{city}</strong>. Missa inte!',
		ctaPicked: 'Visa / ändra val →',
		ctaNotPicked: 'Välj dina förare →',
		footer:
			'Du får det här mejlet eftersom du har påminnelser på tävlingsdagar aktiverade i Speedway Fantasy. <link>Hantera inställningar</link>'
	},
	VenueHistory: {
		firstGpIn: 'Första GP:t i {city}',
		noPreviousResults: 'Inga tidigare resultat på den här banan.',
		lastTimeIn: 'Senast i {city}',
		bestRider: 'Bästa förare',
		bestPlayers: 'Bästa spelare',
		more: '+{count} till',
		you: 'Du'
	},
	RiderHero: {
		timesPicked: 'Antal gånger vald'
	},
	Standings: {
		formTotal: 'Totalt',
		formLast2: 'Senaste 2',
		formLast4: 'Senaste 4'
	},
	YearSelector: {
		years: 'År',
		allTime: 'Alla år',
		reset: 'Återställ',
		toCurrentYear: 'till innevarande år'
	},
	Home: {
		welcome: 'Välkommen till <accent>Speedway Fantasy</accent>',
		viewRules: 'Visa reglerna',
		featurePick: 'Välj 3 förare i varje GP',
		featureEarn: 'Få deras heatpoäng',
		featureClimb: 'Klättra i tabellen',
		signInToPlay: 'Logga in för att spela',
		nextGp: 'Nästa <accent>GP</accent>',
		previousGp: 'Föregående <accent>GP</accent>',
		viewGp: 'Visa GP',
		previousSeason: 'Föregående <accent>säsong</accent>',
		seasonProgress: 'Säsongens förlopp',
		seasonYear: 'Säsong {year}',
		currentPodium: 'Aktuell <accent>pall</accent>',
		finalPodium: 'Slutlig <accent>pall</accent>',
		viewStandings: 'Visa tabellen'
	},
	Countdown: {
		days: 'dagar',
		hours: 'tim',
		minutes: 'min',
		seconds: 'sek'
	},
	GpCard: {
		registeredPlayers:
			'{count, plural, one {<num>#</num> registrerad spelare} other {<num>#</num> registrerade spelare}}',
		whereYouAre: 'Hos dig {time}',
		topPlayers: 'Topp <accent>{limit}</accent> spelare',
		topRiders: 'Topp <accent>{limit}</accent> förare',
		pickedRiders: 'Valda förare',
		myPickedRiders: 'Mina valda förare',
		editPicks: 'Ändra',
		pickRiders: 'Välj förare',
		pickedBy: 'Vald av'
	},
	PickRiders: {
		title: 'Välj dina <accent>3</accent> förare',
		save: 'Spara val',
		saving: 'Sparar…',
		saved: 'Dina val är sparade!',
		closed: 'Valen är låsta för det här GP:t.'
	},
	Activity: {
		picked: 'Valde',
		updated: 'Ändrade'
	},
	Beer: {
		title: 'Bjud på en bärs',
		paragraph1:
			'Speedway Fantasy är ett hjärteprojekt - ett spel som är gratis att spela och alltid kommer att vara det. Alla ska kunna vara med!',
		paragraph2:
			'Men även om spelet är gratis kostar det en hel del att driva. Servrar, domäner, utvecklingsverktyg och många timmars arbete ligger bakom det du ser.',
		paragraph3:
			'Om du tycker att spelet är kul och vill visa ditt stöd, så har du här möjligheten att "bjuda mig på en bärs". En liten gest som betyder mycket och hjälper mig att hålla spelet vid liv och fortsätta utveckla det!',
		paragraph4:
			'Självklart är detta helt frivilligt - spelet kommer alltid att finnas kvar oavsett. Målet är inte att tjäna pengar - det är att öka intresset för sporten. Men all support tas emot med ett stort tack!',
		signoff: 'Tack för att du spelar,\nAlbin',
		card: 'Kort',
		swishLogo: 'Swish-logga',
		swishQr: 'QR-kod för Swish'
	},
	Install: {
		title: 'Installera app',
		intro:
			'Speedway Fantasy fungerar direkt i din webbläsare - ingen App store behövs. Lägg till den på hemskärmen för snabb åtkomst och en helskärms- och app-liknande upplevelse.',
		ios: {
			step1:
				'Tryck på delningsikonen i Safaris verktygsfält (kvadraten med en pil som pekar uppåt).',
			step2:
				'Scrolla ner i delningsmenyn och tryck på "Lägg till på hemskärmen".',
			step3: 'Tryck på "Lägg till" i det övre högra hörnet för att bekräfta.'
		},
		android: {
			step1: 'Tryck på menyn med tre punkter i Chromes övre högra hörn.',
			step2:
				'Tryck på "Lägg till på hemskärmen" (visas ibland som "Installera app").',
			step3: 'Tryck på "Lägg till" eller "Installera" för att bekräfta.'
		}
	},
	Season2027: {
		heading: 'Stora förändringar <year>2027</year>',
		title:
			'Nu tar Speedway Fantasy nästa steg — ett budgetsystem för att sätta ditt lag.',
		budget: {
			label: 'Budget',
			text: 'Inför varje GP har du 10 coins att spendera.'
		},
		riderPicks: {
			label: 'Val av förare',
			text: 'Du väljer fortfarande tre förare, men deras sammanlagda kostnad måste rymmas inom budgeten.'
		},
		priceTiers: {
			label: 'Prisnivåer',
			text: 'Förarna delas in i fem nivåer — 5, 4, 3, 2 och 1 coin. De tre högst rankade kostar 5 coins, nästa tre kostar 4, och så vidare. De fyra lägst rankade kostar 1 coin.'
		},
		keepTeam: {
			label: 'Behåll ditt lag',
			text: 'Gör du inga ändringar följer dina förare automatiskt med till nästa GP.'
		},
		transferWindow: {
			label: 'Transferfönster',
			text: 'Efter varje GP uppdateras priserna och ett nytt transferfönster öppnas. Byt så mycket du vill fram tills nästa GP startar — precis som idag.'
		},
		lockedPrice: {
			label: 'Låst pris',
			text: 'Priset du betalar för en förare låses fast. Även om förarens värde ändras senare behåller du föraren till samma pris.'
		},
		privateTrades: {
			label: 'Hemliga byten',
			text: 'Dina byten är privata tills valen låses när GP:t startar — precis som idag.'
		},
		tbdNote:
			'Exakt hur beräkningen av prisnivåerna går till är fortfarande under arbete och kommer att förtydligas innan säsongen 2027 drar igång.'
	}
}

export default sv
