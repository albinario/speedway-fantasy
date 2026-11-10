import type { ReactNode } from 'react'

// Renderers for tags used in rich messages, e.g. t.rich('nextGp', { accent })
export const accent = (chunks: ReactNode) => (
	<span className="text-green-400">{chunks}</span>
)
