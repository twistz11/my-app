import React from 'react'
import styles from './Footer.module.css'

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.left}>
				Advertising & partnership: +371 295 90 85 or howhopy@gmail.com
			</div>
			<div className={styles.right}>
				©2025 Cinemabookingsite.com All rights reserved.
			</div>
		</footer>
	)
}

export default Footer
