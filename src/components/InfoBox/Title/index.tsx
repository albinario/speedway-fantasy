type TInfoBoxTitle = {
	children: React.ReactNode
}

export function InfoBoxTitle({ children }: TInfoBoxTitle) {
	return <span className="text-muted-foreground text-sm">{children}</span>
}
