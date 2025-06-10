import styles from './IconButton.module.css'

interface IconButtonProps {
	direction: 'left' | 'right'
	disable?: boolean
	onClick?: () => void
}

export const IconButton = ({
	direction,
	disable,
	onClick,
}: IconButtonProps) => {
	let cls = styles.button

	if (direction === 'left') cls += ` ${styles.left}`
	if (direction === 'right') cls += ` ${styles.right}`
	if (disable) cls += ` ${styles.disable}`

	return <div className={cls} onClick={onClick} />
}
