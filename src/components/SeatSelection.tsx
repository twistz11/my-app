import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import MovieService from '../services/MovieService'
import { IMovie } from '../models/IMovie'
import styles from './SeatSelection.module.css'
import $api from '../http'
import { Context } from '../index'
import { startDateUTC, getActiveMovieIndexes } from '../utils/scheduleHelpers'

const rows = 6
const seatsPerRow = 10
const msPerWeek = 7 * 24 * 60 * 60 * 1000

type Seat = {
	row: number
	seat: number
	status: 'available' | 'selected' | 'taken'
	type: 'vip' | 'regular'
}

const generateInitialLayout = (): Seat[][] =>
	Array.from({ length: rows }, (_, rowIdx) =>
		Array.from({ length: seatsPerRow }, (_, seatIdx) => {
			const isVip = rowIdx < 2
			return {
				row: rowIdx + 1,
				seat: seatIdx + 1,
				status: 'available',
				type: isVip ? 'vip' : 'regular',
			}
		})
	)

const getPrice = (type: 'vip' | 'regular') => (type === 'vip' ? 12 : 10)

type TakenSeat = { row: number; seat: number }

const SeatSelection = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const movieId = searchParams.get('movieId') || ''
	const date = searchParams.get('date') || ''
	const time = searchParams.get('time') || ''
	const hall = searchParams.get('hall') || '№1'

	const { store } = useContext(Context)
	const [movie, setMovie] = useState<IMovie | null>(null)
	const [layout, setLayout] = useState<Seat[][]>(generateInitialLayout())
	const [cart, setCart] = useState<Seat[]>([])
	const [dateError, setDateError] = useState<string>('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (movieId && date) {
			MovieService.fetchMovies().then(res => {
				const d = new Date(date)
				const weekIdx = Math.floor((+d - +startDateUTC) / msPerWeek)
				const validStart = new Date(
					startDateUTC.getTime() + weekIdx * msPerWeek
				)
				const validEnd = new Date(validStart.getTime() + msPerWeek - 1)
				const activeIndexes = getActiveMovieIndexes(weekIdx)
				const activeIds = activeIndexes.map(i => res.data[i]?._id)
				if (!date || !activeIds.includes(movieId)) {
					setDateError(
						`This movie is only available from ${
							validStart.toISOString().split('T')[0]
						} to ${validEnd.toISOString().split('T')[0]}.`
					)
				} else {
					setDateError('')
				}
			})

			MovieService.getOneMovie(movieId).then(res => setMovie(res.data))

			$api
				.get('/bookings', {
					params: { movieId, date, time, hall },
				})
				.then(res => {
					const taken: TakenSeat[] = res.data
					setLayout(
						generateInitialLayout().map(row =>
							row.map(seat => {
								if (
									taken.some(t => t.row === seat.row && t.seat === seat.seat)
								) {
									return { ...seat, status: 'taken' }
								}
								return seat
							})
						)
					)
				})
				.catch(err => {
					console.error('Error loading taken seats:', err)
				})
		}
		// eslint-disable-next-line
	}, [movieId, date, time, hall])

	const handleSeatClick = (rowIdx: number, seatIdx: number) => {
		setLayout(prev =>
			prev.map((row, r) =>
				row.map((seat, s) => {
					if (r === rowIdx && s === seatIdx && seat.status !== 'taken') {
						const isSelected = seat.status === 'selected'
						const updated: Seat = {
							...seat,
							status: isSelected ? 'available' : 'selected',
						}
						setCart(c => {
							if (isSelected) {
								return c.filter(
									cs => !(cs.row === updated.row && cs.seat === updated.seat)
								)
							} else {
								const exists = c.some(
									cs => cs.row === updated.row && cs.seat === updated.seat
								)
								return exists ? c : [...c, updated]
							}
						})
						return updated
					}
					return seat
				})
			)
		)
	}

	const handleCheckout = async () => {
		if (!movieId || !date || !time || !hall) return

		if (!store.user.id || !store.user.isActivated) {
			alert('Please log in and verify your email before booking.')
			return
		}

		if (cart.length === 0) {
			alert('Please select at least one seat.')
			return
		}

		setLoading(true)
		try {
			await $api.post('/book', {
				userId: store.user.id,
				movieId,
				date,
				time,
				hall,
				seats: cart.map(s => ({
					row: s.row,
					seat: s.seat,
					type: s.type,
					price: getPrice(s.type),
				})),
			})

			const takenSeats = cart.map(c => ({ row: c.row, seat: c.seat }))
			setLayout(prev =>
				prev.map(row =>
					row.map(seat => {
						if (
							takenSeats.some(
								ts => ts.row === seat.row && ts.seat === seat.seat
							)
						) {
							return { ...seat, status: 'taken' }
						}
						return seat
					})
				)
			)
			setCart([])
			alert('Booking successful! Confirmation sent to your email.')
		} catch (err) {
			console.error('Booking failed:', err)
			alert('Something went wrong while booking your seats.')
		}
		setLoading(false)
	}

	if (dateError) {
		return (
			<div style={{ color: 'orange', padding: 40, textAlign: 'center' }}>
				<h2>Unavailable</h2>
				<p>{dateError}</p>
				<button onClick={() => navigate('/movies')}>Back to movies</button>
			</div>
		)
	}

	const total = cart.reduce((sum, s) => sum + getPrice(s.type), 0)

	return (
		<div className={styles.wrapper}>
			<div className={styles.leftColumn}>
				{movie && (
					<>
						<img
							src={movie.imageUrl}
							alt='Movie Poster'
							className={styles.imagePlaceholder}
						/>
						<div className={styles.description}>
							<strong>{movie.title}</strong>
						</div>
						<div className={styles.description}>
							{movie.description?.trim() || 'No description available.'}
						</div>
						<div className={styles.description}>
							<strong>Date:</strong> {date}
						</div>
						<div className={styles.description}>
							<strong>Time:</strong> {time}
						</div>
						<div className={styles.description}>
							<strong>Hall:</strong> {hall}
						</div>
					</>
				)}
			</div>

			<div className={styles.seatContainer}>
				<div className={styles.legend}>
					<span className={styles.vip}>Vip</span>
					<span className={styles.regular}>Regular</span>
					<span className={styles.taken}>Taken</span>
					<span className={styles.selected}>In cart</span>
				</div>
				<div className={styles.seats}>
					{layout.map((row, rIdx) => (
						<div key={rIdx} className={styles.row}>
							{row.map((seat, sIdx) => (
								<div
									key={sIdx}
									className={`${styles.seat} ${styles[seat.type]} ${
										seat.status === 'taken'
											? styles.taken
											: seat.status === 'selected'
											? styles.selected
											: ''
									}`}
									onClick={() => handleSeatClick(rIdx, sIdx)}
								></div>
							))}
						</div>
					))}
				</div>
				<div className={styles.screen}>Scene here</div>
			</div>

			<div className={styles.cart}>
				<h3>Your Cart</h3>
				{cart.map((seat, i) => (
					<div key={i} className={styles.cartItem}>
						<span>
							Row: {seat.row}, Seat: {seat.seat} — €{getPrice(seat.type)}
						</span>
						<button
							onClick={() => handleSeatClick(seat.row - 1, seat.seat - 1)}
							className={styles.removeBtn}
						>
							Remove
						</button>
					</div>
				))}
				<hr />
				<p>Total: €{total}</p>
				<button
					className={styles.checkoutBtn}
					onClick={handleCheckout}
					disabled={loading || cart.length === 0}
				>
					{loading ? 'Booking...' : 'Go to Checkout'}
				</button>
			</div>
		</div>
	)
}

export default SeatSelection
