import { useState } from 'react'
import styles from './ImageSlider.module.css'

type Props = {
	imageUrls: string[]
}

export const ImageSlider = ({ imageUrls }: Props) => {
	const [index, setIndex] = useState(0)

	const showNext = () => setIndex(i => (i === imageUrls.length - 1 ? 0 : i + 1))
	const showPrev = () => setIndex(i => (i === 0 ? imageUrls.length - 1 : i - 1))

	return (
		<div className={styles.slider}>
			<img
				src={imageUrls[index]}
				alt=''
				className={styles.img}
				draggable={false}
			/>
			<button className={styles.btn + ' ' + styles.left} onClick={showPrev}>
				&#8592;
			</button>
			<button className={styles.btn + ' ' + styles.right} onClick={showNext}>
				&#8594;
			</button>
			<div className={styles.dots}>
				{imageUrls.map((_, i) => (
					<button
						key={i}
						className={styles.dot + (i === index ? ' ' + styles.active : '')}
						onClick={() => setIndex(i)}
					/>
				))}
			</div>
		</div>
	)
}
