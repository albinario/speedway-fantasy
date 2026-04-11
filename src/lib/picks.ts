type TPicksRow = {
	pick_1_country: string | null
	pick_1_number: number | null
	pick_2_country: string | null
	pick_2_number: number | null
	pick_3_country: string | null
	pick_3_number: number | null
}

export function sortedPicks(row: TPicksRow) {
	return [
		{ countryCode: row.pick_1_country, number: row.pick_1_number },
		{ countryCode: row.pick_2_country, number: row.pick_2_number },
		{ countryCode: row.pick_3_country, number: row.pick_3_number }
	].sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
}
