'use client'

import { useRouter, useSearchParams } from 'next/navigation'

type TView = 'players' | 'riders'

export function StandingsToggle({ view }: { view: TView }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	function setView(next: TView) {
		const params = new URLSearchParams(searchParams.toString())
		params.set('view', next)
		router.push(`?${params.toString()}`)
	}

	return (
		<div className="bg-muted relative flex rounded-lg p-1">
			<div
				className={`bg-background absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-md shadow-sm transition-transform duration-200 ${view === 'riders' ? 'translate-x-full' : 'translate-x-0'}`}
			/>
			{(['players', 'riders'] as TView[]).map((v) => (
				<button
					key={v}
					onClick={() => setView(v)}
					className={`relative z-10 flex-1 py-2 text-sm font-black uppercase transition-colors duration-200 ${
						view === v
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					{v}
				</button>
			))}
		</div>
	)
}
