import { useState } from 'react'
import { IconButton } from './IconButton'
import styles from './Slider.module.css'

interface SliderProps {
	data: { img: string }[]
}

export const Slider = ({ data }: SliderProps) => {
	const [activeId, setActiveId] = useState(0)

	const prev = () => setActiveId(id => (id > 0 ? id - 1 : id))
	const next = () => setActiveId(id => (id < data.length - 1 ? id + 1 : id))

	return (
		<div className={styles.sliderSection}>
			<div className={styles.slider__actions}>
				<IconButton direction='left' onClick={prev} disable={activeId === 0} />
				<IconButton
					direction='right'
					onClick={next}
					disable={activeId === data.length - 1}
				/>
			</div>
			<div className={styles.sliderWrap}>
				<div className={styles.slider}>
					{data.map((slide, idx) => (
						<div
							key={idx}
							className={`${styles.slide} ${
								idx === activeId ? styles.active : ''
							}`}
						>
							<img src={slide.img} alt={`slide-${idx}`} />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
