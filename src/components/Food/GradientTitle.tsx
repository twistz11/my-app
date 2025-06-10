import styles from './GradientTitle.module.css'

export const GradientTitle = ({ children }: { children: React.ReactNode }) => (
	<h1 className={styles.gradientTitle}>{children}</h1>
)
