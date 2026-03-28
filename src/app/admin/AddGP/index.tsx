'use client'

import { useState } from 'react'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import type { getCities } from '../data'
import { addGP } from './actions'

type TAddGP = {
	cities: Awaited<ReturnType<typeof getCities>>
}

export function AddGP({ cities }: TAddGP) {
	const [round, setRound] = useState('')
	const today = new Date().toISOString().slice(0, 10)
	const [startDate, setStartDate] = useState(`${today}T19:00`)
	const [cityId, setCityId] = useState('')
	const disabled = !round || !startDate || !cityId

	async function handleAction(formData: FormData) {
		const result = await addGP(formData)
		if (result.error) {
			toast.error(result.error)
			return
		}
		setRound('')
		setStartDate(`${new Date().toISOString().slice(0, 10)}T19:00`)
		setCityId('')
		toast.success('GP added successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add GP</CardTitle>
				<CardDescription>Add a new Grand Prix to the database.</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="add-gp-form" action={handleAction}>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="round">Round</Label>

							<Input
								autoFocus
								id="round"
								name="round"
								onChange={(e) => setRound(e.target.value)}
								required
								type="number"
								value={round}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="start_date">Start date &amp; time (local)</Label>

							<Input
								id="start_date"
								name="start_date"
								onChange={(e) => setStartDate(e.target.value)}
								required
								type="datetime-local"
								value={startDate}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="city_id">City</Label>

							<Select name="city_id" value={cityId} onValueChange={setCityId}>
								<SelectTrigger id="city_id">
									<SelectValue placeholder="Select a city" />
								</SelectTrigger>

								<SelectContent>
									{cities.map((city) => (
										<SelectItem key={city.id} value={String(city.id)}>
											{city.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					form="add-gp-form"
					className="w-full"
					disabled={disabled}
				>
					Add GP
				</Button>
			</CardFooter>
		</Card>
	)
}
