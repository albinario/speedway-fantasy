import { card } from './styles.css'

type TCard = React.HTMLAttributes<HTMLDivElement>

export function Card({ children, ...props }: TCard) {
	return (
		<div className={card} {...props}>
			{children}
		</div>
	)
}
