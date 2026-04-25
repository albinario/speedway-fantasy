'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

type Props = {
	text: string
}

export function CopyButton({ text }: Props) {
	const [copied, setCopied] = useState(false)

	async function handleCopy() {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Button variant="outline" size="sm" onClick={handleCopy}>
			{copied ? <Check className="text-green-400" /> : <Copy />}
			{copied ? 'Copied' : 'Copy'}
		</Button>
	)
}
