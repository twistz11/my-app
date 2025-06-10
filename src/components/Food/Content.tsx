import { GradientTitle } from './GradientTitle'
import { Slider } from './Slider'

import photo_1 from '../../assets/images/1_photo.png'
import photo_2 from '../../assets/images/2_photo.png'
import photo_3 from '../../assets/images/3_photo.png'
import photo_4 from '../../assets/images/4_photo.png'
import photo_5 from '../../assets/images/5_photo.png'
import photo_6 from '../../assets/images/6_photo.png'

import styles from './Content.module.css'

const sliderData = [
	{ img: photo_1 },
	{ img: photo_2 },
	{ img: photo_3 },
	{ img: photo_4 },
	{ img: photo_5 },
	{ img: photo_6 },
]

export const Content = () => (
	<div className={styles.content}>
		<GradientTitle>Our food</GradientTitle>
		<div className={styles.content__grid}>
			<p>
				From crispy fries and crunchy chips to juicy sandwiches stacked with
				flavor, we have everything to keep your taste buds happy. Craving
				something sweet? Try our colorful gummy bears or classic popcorn. Wash
				it all down with an ice cold drink and enjoy your movie with the perfect
				snack in hand.
			</p>
		</div>
		<Slider data={sliderData} />
	</div>
)
