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

import type { getCountries } from '../data'
import { addCity } from './actions'

type TAddCity = {
	countries: Awaited<ReturnType<typeof getCountries>>
}

export function AddCity({ countries }: TAddCity) {
	const [name, setName] = useState('')
	const [countryId, setCountryId] = useState('')
	const disabled = !name.trim() || !countryId

	async function handleAction(formData: FormData) {
		const result = await addCity(formData)
		if (result.error) {
			toast.error(result.error)
			return
		}
		setName('')
		setCountryId('')
		toast.success('City added successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add city</CardTitle>
				<CardDescription>Add a new city to the database.</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="add-city-form" action={handleAction}>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>

							<Input
								autoFocus
								id="name"
								name="name"
								onChange={(e) => setName(e.target.value)}
								required
								type="text"
								value={name}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="country_id">Country</Label>

							<Select
								name="country_id"
								value={countryId}
								onValueChange={setCountryId}
							>
								<SelectTrigger id="country_id" className="w-full">
									<SelectValue placeholder="Select a country" />
								</SelectTrigger>

								<SelectContent>
									{countries.map((country) => (
										<SelectItem key={country.id} value={String(country.id)}>
											{country.name}
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
					form="add-city-form"
					className="w-full"
					disabled={disabled}
				>
					Add city
				</Button>
			</CardFooter>
		</Card>
	)
}
