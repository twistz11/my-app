import styles from './AboutUs.module.css'

const AboutUs = () => {
	return (
		<div className={styles.aboutUs}>
			<h1>About Us</h1>

			<div className={styles.section}>
				<img src='/about1.png' alt='Immersive experience' />
				<div>
					<h2>Complete Immersion</h2>
					<p>
						Our cinema is designed to make every visit special. From soft,
						modern seating to perfect acoustics and screen angles, each detail
						helps you fully engage with the movie. Whether you're on a date
						night or enjoying time with friends, the atmosphere ensures a
						memorable experience.
					</p>
				</div>
			</div>

			<div className={styles.section}>
				<img src='/about2.png' alt='Top-tier projection' />
				<div>
					<h2>Cutting-Edge Visuals</h2>
					<p>
						We use the latest projection systems and high-contrast screens to
						deliver brilliant colors and stunning detail. From epic action to
						quiet drama, every frame is shown the way the creators intended —
						sharp, clear, and unforgettable.
					</p>
				</div>
			</div>

			<div className={styles.section}>
				<img src='/about3.png' alt='Cinema halls and comfort' />
				<div>
					<h2>Modern Halls & Comfort</h2>
					<p>
						Each of our 7 screening rooms offers comfort and atmosphere.
						Spacious rows, reclinable chairs, and well-placed aisles ensure a
						smooth and relaxed moviegoing experience. No distractions — just
						movies and you.
					</p>
				</div>
			</div>

			<div className={styles.section}>
				<img src='/about4.png' alt='3D experience' />
				<div>
					<h2>High-Quality 3D</h2>
					<p>
						Enjoy crystal-clear 3D movies with vibrant color depth and zero
						blur. Our SilverScreen+Hall Spectral technology delivers
						true-to-life depth and sharpness, ensuring your 3D experience is
						smooth and visually stunning — no motion sickness, just thrills.
					</p>
				</div>
			</div>
		</div>
	)
}

export default AboutUs
