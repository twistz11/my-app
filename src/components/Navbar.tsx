import React, { useState, useContext } from 'react'
import styles from './Navbar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'

const Navbar = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const navigate = useNavigate()
	const { store } = useContext(Context)

	return (
		<nav className={styles.navbar}>
			<div className={styles.left}>
				<Link to='/'>
					<img src='/logo.png' alt='Logo' className={styles.logo} />
				</Link>

				<ul className={styles.center}>
					<li>
						<Link className={styles.link} to='/schedule'>
							Schedule
						</Link>
					</li>
					<li>
						<Link className={styles.link} to='/movies'>
							Movies
						</Link>
					</li>
				</ul>
			</div>

			<div className={styles.right}>
				<span className={styles.login} onClick={() => navigate('/account')}>
					{store.isAuth ? 'My Profile' : 'Registration/Login'}
				</span>

				<span
					className={styles.menuIcon}
					onClick={() => setMenuOpen(!menuOpen)}
				>
					☰
				</span>
			</div>

			{menuOpen && (
				<div className={styles.dropdown}>
					<Link to='/' onClick={() => setMenuOpen(false)}>
						Home
					</Link>
					<Link to='/schedule' onClick={() => setMenuOpen(false)}>
						Schedule
					</Link>
					<Link to='/movies' onClick={() => setMenuOpen(false)}>
						Movies
					</Link>
					<Link to='/food' onClick={() => setMenuOpen(false)}>
						Food
					</Link>
					<Link to='/about' onClick={() => setMenuOpen(false)}>
						About us
					</Link>
				</div>
			)}
		</nav>
	)
}

export default observer(Navbar)
