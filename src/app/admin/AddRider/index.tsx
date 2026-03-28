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
import { addRider } from './actions'

type TAddRider = {
	countries: Awaited<ReturnType<typeof getCountries>>
}

export function AddRider({ countries }: TAddRider) {
	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [countryId, setCountryId] = useState('')
	const disabled = !name.trim() || !number || !countryId

	async function handleAction(formData: FormData) {
		const result = await addRider(formData)
		if (result.error) {
			toast.error(result.error)
			return
		}
		setName('')
		setNumber('')
		setCountryId('')
		toast.success('Rider added successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add rider</CardTitle>
				<CardDescription>Add a new rider to the database.</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="add-rider-form" action={handleAction}>
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
							<Label htmlFor="number">Number</Label>

							<Input
								id="number"
								name="number"
								onChange={(e) => setNumber(e.target.value)}
								required
								type="number"
								value={number}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="country_id">Country</Label>

							<Select
								name="country_id"
								value={countryId}
								onValueChange={setCountryId}
							>
								<SelectTrigger id="country_id">
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
					form="add-rider-form"
					className="w-full"
					disabled={disabled}
				>
					Add rider
				</Button>
			</CardFooter>
		</Card>
	)
}
