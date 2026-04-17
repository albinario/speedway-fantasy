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
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'

import type { getGPsWildCard, getRidersWildCard } from '../data'
import { assignWildCard } from './actions'

type TAssignWildCard = {
	gps: Awaited<ReturnType<typeof getGPsWildCard>>
	riders: Awaited<ReturnType<typeof getRidersWildCard>>
}

export function AssignWildCard({ gps, riders }: TAssignWildCard) {
	const [gpId, setGpId] = useState('')
	const [riderId, setRiderId] = useState('')
	const disabled = !gpId || !riderId

	async function handleAction(formData: FormData) {
		const result = await assignWildCard(formData)
		if (result.error) {
			toast.error(result.error)
			return
		}
		setGpId('')
		setRiderId('')
		toast.success('Wild card assigned successfully')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Assign wild card</CardTitle>
				<CardDescription>Assign a wild card rider to a GP.</CardDescription>
			</CardHeader>

			<CardContent>
				<form id="assign-wild-card-form" action={handleAction}>
					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="gp_id">GP</Label>

							<Select name="gp_id" value={gpId} onValueChange={setGpId}>
								<SelectTrigger id="gp_id" className="w-full">
									<SelectValue placeholder="Select a GP" />
								</SelectTrigger>

								<SelectContent>
									{gps.map((gp) => (
										<SelectItem key={gp.id} value={String(gp.id)}>
											{gp.round}. {gp.city_name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="rider_id">Rider</Label>

							<Select
								name="rider_id"
								value={riderId}
								onValueChange={setRiderId}
							>
								<SelectTrigger id="rider_id" className="w-full">
									<SelectValue placeholder="Select a rider" />
								</SelectTrigger>

								<SelectContent>
									{riders.map((rider) => (
										<SelectItem key={rider.id} value={String(rider.id)}>
											{rider.name}
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
					form="assign-wild-card-form"
					className="w-full"
					disabled={disabled}
				>
					Assign wild card
				</Button>
			</CardFooter>
		</Card>
	)
}
