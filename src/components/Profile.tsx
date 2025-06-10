import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'
import $api from '../http'
import styles from './Profile.module.css'

interface Booking {
	_id: string
	date: string
	time: string
	hall: string
	seats: {
		row: number
		seat: number
		price: number
		type: string
	}[]
	movieId: {
		title: string
	}
}

const getMaxDate = (minAge: number) => {
	const now = new Date()
	now.setFullYear(now.getFullYear() - minAge)
	return now.toISOString().split('T')[0]
}

const Profile = () => {
	const { store } = useContext(Context)

	const [newBirthdate, setNewBirthdate] = useState(store.user.birthdate || '')
	const [birthdateChangedAt, setBirthdateChangedAt] = useState<Date | null>(
		null
	)
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [message, setMessage] = useState('')
	const [resendCooldown, setResendCooldown] = useState(0)
	const [bookings, setBookings] = useState<Booking[]>([])

	useEffect(() => {
		if (resendCooldown > 0) {
			const timer = setTimeout(() => setResendCooldown(prev => prev - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [resendCooldown])

	useEffect(() => {
		if (store.user.id) {
			$api
				.get('/my-bookings', { params: { userId: store.user.id } })
				.then(res => setBookings(res.data))
				.catch(err => console.error('Failed to load bookings:', err))
		}
	}, [store.user.id])

	const canChangeBirthdate = () => {
		if (!birthdateChangedAt) return true
		const now = new Date()
		const diff = now.getTime() - birthdateChangedAt.getTime()
		return diff / (1000 * 3600 * 24) >= 365
	}

	const handleBirthdateChange = async () => {
		setMessage('')
		try {
			if (!newBirthdate.trim()) return setMessage('Please enter your birthdate')
			if (new Date(newBirthdate) > new Date())
				return setMessage('Birthdate cannot be in the future')
			if (!canChangeBirthdate())
				return setMessage('You can only update birthdate once per year')

			await $api.post('/update-birthdate', {
				email: store.user.email,
				birthdate: newBirthdate,
			})
			store.setUser({ ...store.user, birthdate: newBirthdate })
			setBirthdateChangedAt(new Date())
			setMessage('Birthdate updated successfully')
		} catch (e: any) {
			setMessage(e.response?.data?.message || 'Error updating birthdate')
		}
	}

	const handlePasswordChange = async () => {
		setMessage('')
		if (!currentPassword || !newPassword)
			return setMessage('Fill in all fields')
		if (newPassword.length < 3 || newPassword.length > 32)
			return setMessage('Password must be 3–32 characters')

		try {
			await $api.post('/change-password', {
				email: store.user.email,
				currentPassword,
				newPassword,
			})
			setMessage('Password changed successfully')
			setCurrentPassword('')
			setNewPassword('')
		} catch (e: any) {
			setMessage(e.response?.data?.message || 'Error changing password')
		}
	}

	const handleLogout = async () => {
		try {
			await store.logout()
			window.location.reload()
		} catch (e) {
			console.log(e)
		}
	}

	const handleResendActivation = async () => {
		try {
			await $api.post('/resend-activation', { email: store.user.email })
			setMessage('Activation link sent to your email')
			setResendCooldown(120)
		} catch (e: any) {
			setMessage(
				e.response?.data?.message || 'Error resending activation email'
			)
		}
	}

	return (
		<div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
			<div className={styles.profileContainer}>
				<h2 className={styles.profileTitle}>My Profile</h2>

				<p>
					<strong>Email:</strong> {store.user.email}{' '}
					<span
						style={{
							color: store.user.isActivated ? 'limegreen' : 'orangered',
						}}
					>
						{store.user.isActivated ? '✔ Verified' : '✖ Not verified'}
					</span>
				</p>

				{!store.user.isActivated && (
					<div style={{ marginTop: '10px' }}>
						<button
							onClick={handleResendActivation}
							className={styles.profileButton}
							disabled={resendCooldown > 0}
						>
							{resendCooldown > 0
								? `Resend in ${resendCooldown}s`
								: 'Resend Activation Email'}
						</button>
					</div>
				)}

				{store.user.birthdate && (
					<p style={{ marginTop: '10px' }}>
						<strong>Birthdate:</strong> {store.user.birthdate}
					</p>
				)}

				<div className={styles.profileField}>
					<label>Update Birthdate:</label>
					<input
						type='date'
						value={newBirthdate}
						onChange={e => setNewBirthdate(e.target.value)}
						className={styles.profileInput}
						max={getMaxDate(10)}
					/>
					<button
						className={styles.profileButton}
						onClick={handleBirthdateChange}
					>
						Update Birthdate
					</button>
				</div>

				<div className={styles.profileField}>
					<h3>Change Password</h3>
					<input
						type='password'
						value={currentPassword}
						placeholder='Current password'
						onChange={e => setCurrentPassword(e.target.value)}
						className={styles.profileInput}
					/>
					<input
						type='password'
						value={newPassword}
						placeholder='New password'
						onChange={e => setNewPassword(e.target.value)}
						className={styles.profileInput}
					/>
					<button
						className={styles.profileButton}
						onClick={handlePasswordChange}
					>
						Change Password
					</button>
				</div>

				<button onClick={handleLogout} className={styles.logoutButton}>
					Log out
				</button>

				{message && <p className={styles.profileMessage}>{message}</p>}
			</div>

			<div style={{ flex: 1 }}>
				<h2 style={{ marginBottom: '20px' }}>Your Tickets</h2>
				{bookings.length === 0 ? (
					<p>No bookings yet.</p>
				) : (
					<div
						style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
					>
						{bookings.map(booking => (
							<div
								key={booking._id}
								style={{
									border: '1px solid #444',
									borderRadius: '10px',
									padding: '16px',
									background: '#1e1e1e',
								}}
							>
								<h3>{booking.movieId.title}</h3>
								<p>
									<strong>Date:</strong> {booking.date} &nbsp;
									<strong>Time:</strong> {booking.time} &nbsp;
									<strong>Hall:</strong> {booking.hall}
								</p>
								<p>
									<strong>Seats:</strong>{' '}
									{booking.seats
										.map(s => `Row ${s.row}, Seat ${s.seat} (€${s.price})`)
										.join('; ')}
								</p>
								<p>
									<strong>Total:</strong> €
									{booking.seats.reduce((sum, s) => sum + s.price, 0)}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}

export default observer(Profile)
