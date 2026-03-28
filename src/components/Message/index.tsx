
type TMessage = {
	content?: string
	label?: string
}

export function Message({ content, label }: TMessage) {
	return (
		<>
			{label ? <h1>{label}</h1> : null}
			{content ? <p>{content}</p> : null}
		</>
	)
}
