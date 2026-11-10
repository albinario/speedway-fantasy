'use client'

import { useActionState, useState } from 'react'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { saveProfile, TSaveProfileState } from './actions'

type TOnboardingForm = {
	action: typeof saveProfile
}

const initialState: TSaveProfileState = {}

export function OnboardingForm({ action }: TOnboardingForm) {
	const t = useTranslations('Onboarding')
	const [state, formAction, isPending] = useActionState(action, initialState)
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const disabled = !firstName.trim() || !lastName.trim() || isPending

	return (
		<>
			<CardContent>
				<form id="onboarding-form" action={formAction}>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="first_name">{t('firstName')}</Label>
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
							<Label htmlFor="last_name">{t('lastName')}</Label>
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

						{state.error && (
							<p className="text-destructive text-sm" role="alert">
								{t(state.error)}
							</p>
						)}
					</div>
				</form>
			</CardContent>

			<CardFooter>
				<Button
					type="submit"
					form="onboarding-form"
					className="w-full"
					disabled={disabled}
					size="lg"
				>
					{isPending ? t('saving') : t('submit')}
				</Button>
			</CardFooter>
		</>
	)
}
