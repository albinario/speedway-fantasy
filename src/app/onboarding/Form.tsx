'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TOnboardingForm = {
	action: (formData: FormData) => Promise<void>
}

export function OnboardingForm({ action }: TOnboardingForm) {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const disabled = !firstName.trim() || !lastName.trim()

	return (
		<>
			<CardContent>
				<form id="onboarding-form" action={action}>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first_name">First name</Label>
							<Input
								autoComplete="given-name"
								autoFocus
								id="first_name"
								name="first_name"
								onChange={(e) => setFirstName(e.target.value)}
								required
								type="text"
								value={firstName}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="last_name">Last name</Label>
							<Input
								autoComplete="family-name"
								id="last_name"
								name="last_name"
								onChange={(e) => setLastName(e.target.value)}
								required
								type="text"
								value={lastName}
							/>
						</div>
					</div>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					form="onboarding-form"
					className="w-full"
					disabled={disabled}
				>
					Save and continue
				</Button>
			</CardFooter>
		</>
	)
}
