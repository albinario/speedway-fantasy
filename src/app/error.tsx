'use client'

import { useEffect } from 'react'

import { useTranslations } from 'next-intl'

import { RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import type { TErrorProps } from '@/types/error'

// Error boundary for every page (the root layout is the only layout, so this
// renders inside it and the header/nav stay). The raw error message is never
// shown: in production Next replaces it with a generic English sentence.
export default function ErrorPage({ error, reset }: TErrorProps) {
	const t = useTranslations('Errors')

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<Card className="mx-auto w-full max-w-md">
			<CardHeader>
				<CardTitle>{t('title')}</CardTitle>
				<CardDescription>{t('description')}</CardDescription>
			</CardHeader>

			<CardContent>
				<Button onClick={reset} size="lg" variant="outline">
					<RotateCcw />
					{t('tryAgain')}
				</Button>
			</CardContent>
		</Card>
	)
}
