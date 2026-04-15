import { getGp } from '@/app/gps/[id]/data'
import { GpCard } from '@/components/GpCard'
import { InfoBox } from '@/components/InfoBox'
import { SectionTitle } from '@/components/SectionHeader'

type TColorSwatch = {
	name: string
	hex: string
	textClass: string
	bgClass: string
	contrast: string
	usage: string
}

const existing: TColorSwatch[] = [
	{
		name: 'brand-red',
		hex: '#ff3b1f',
		textClass: 'text-brand-red',
		bgClass: 'bg-brand-red/10',
		contrast: '~9:1',
		usage: 'Primary action, nav, CTA'
	},
	{
		name: 'gold',
		hex: '#ffd700',
		textClass: 'text-gold',
		bgClass: 'bg-gold/10',
		contrast: '~14:1',
		usage: '1st place, medal'
	},
	{
		name: 'silver',
		hex: '#c0c0c0',
		textClass: 'text-silver',
		bgClass: 'bg-silver/10',
		contrast: '~9:1',
		usage: '2nd place, medal'
	},
	{
		name: 'bronze',
		hex: '#cd7f32',
		textClass: 'text-bronze',
		bgClass: 'bg-bronze/10',
		contrast: '~5:1',
		usage: '3rd place, medal'
	},
	{
		name: 'green-400',
		hex: '#4ade80',
		textClass: 'text-green-400',
		bgClass: 'bg-green-400/10',
		contrast: '~9:1',
		usage: 'Success, Picked, registered'
	},
	{
		name: 'yellow-400',
		hex: '#facc15',
		textClass: 'text-yellow-400',
		bgClass: 'bg-yellow-400/10',
		contrast: '~13:1',
		usage: 'Warning, wild card'
	}
]

const proposed: TColorSwatch[] = [
	{
		name: 'orange-400',
		hex: '#fb923c',
		textClass: 'text-orange-400',
		bgClass: 'bg-orange-400/10',
		contrast: '~7.0:1',
		usage: 'Viewer name, caution states'
	}
]

function Swatch({ swatch }: { swatch: TColorSwatch }) {
	return (
		<div className="flex items-center gap-4 py-3">
			{/* Color dot */}
			<div
				className="size-10 shrink-0 rounded-full border border-white/10"
				style={{ backgroundColor: swatch.hex }}
			/>

			{/* Name + hex */}
			<div className="min-w-0 flex-1">
				<div className={`font-mono text-sm font-bold ${swatch.textClass}`}>
					{swatch.name}
				</div>
				<div className="text-muted-foreground font-mono text-xs">
					{swatch.hex}
				</div>
			</div>

			{/* Usage */}
			<div className="text-muted-foreground hidden max-w-48 text-right text-xs sm:block">
				{swatch.usage}
			</div>

			{/* Contrast badge */}
			<div
				className={`shrink-0 rounded px-2 py-1 font-mono text-xs ${swatch.bgClass} ${swatch.textClass}`}
			>
				{swatch.contrast}
			</div>
		</div>
	)
}

export default async function ColorsPage() {
	const gp = await getGp(52)

	return (
		<div className="mx-auto max-w-2xl space-y-6 p-4">
			<div>
				<SectionTitle>Existing colors</SectionTitle>
				<InfoBox>
					<div className="divide-border divide-y">
						{existing.map((s) => (
							<Swatch key={s.name} swatch={s} />
						))}
					</div>
				</InfoBox>
			</div>

			<div>
				<SectionTitle>Proposed additions</SectionTitle>
				<InfoBox>
					<div className="divide-border divide-y">
						{proposed.map((s) => (
							<Swatch key={s.name} swatch={s} />
						))}
					</div>
				</InfoBox>
			</div>

			{gp && (
				<div>
					<SectionTitle>GP card</SectionTitle>
					<GpCard gp={gp} />
				</div>
			)}

			{/* Full spectrum preview */}
			<div>
				<SectionTitle>All together</SectionTitle>
				<InfoBox>
					<div className="4 flex flex-wrap">
						{[...existing, ...proposed].map((s) => (
							<div
								key={s.name}
								className={`rounded-md px-3 py-1.5 text-xs font-bold ${s.bgClass} ${s.textClass}`}
							>
								{s.name}
							</div>
						))}
					</div>
				</InfoBox>
			</div>
		</div>
	)
}
