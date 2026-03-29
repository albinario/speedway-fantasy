type TPageTitle = {
	title: string
}

export function PageTitle({ title }: TPageTitle) {
	return (
		<h1 className="text-muted-foreground text-xl font-black uppercase">{title}</h1>
	)
}
