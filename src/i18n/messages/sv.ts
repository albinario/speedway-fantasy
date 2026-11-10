import type { TMessages } from './en'

const sv: TMessages = {
	LocaleSelector: {
		label: 'Språk'
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
		card: 'Kort'
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
