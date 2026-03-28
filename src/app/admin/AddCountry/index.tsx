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

import { addCountry } from './actions'

export function AddCountry() {
	const [name, setName] = useState('')
	const [code, setCode] = useState('')
	const disabled = !name.trim() || !code.trim()

	async function handleAction(formData: FormData) {
		const result = await addCountry(formData)
		if (result.error) {
			toast.error(result.error)
			return
		}
		setName('')
		setCode('')
		toast.success('Country added successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add country</CardTitle>
				<CardDescription>Add a new country to the database.</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="add-country-form" action={handleAction}>
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
							<Label htmlFor="code">Code</Label>

							<Input
								id="code"
								name="code"
								onChange={(e) => setCode(e.target.value)}
								required
								type="text"
								value={code}
							/>
						</div>
					</div>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					form="add-country-form"
					className="w-full"
					disabled={disabled}
				>
					Add country
				</Button>
			</CardFooter>
		</Card>
	)
}
