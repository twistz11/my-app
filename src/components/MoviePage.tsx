import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MovieService from '../services/MovieService'
import { IMovie } from '../models/IMovie'
import { Context } from '../index'
import styles from './MoviePage.module.css'
import { scheduleMap } from '../utils/SCHEDULE_MAP'
import { startDateUTC } from '../utils/scheduleHelpers'

const msPerWeek = 7 * 24 * 60 * 60 * 1000

const formatDate = (date: Date) =>
	date.toLocaleDateString('en-GB', {
		weekday: 'long',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})

export const MoviePage = () => {
	const { store } = useContext(Context)
	const { id } = useParams()
	const navigate = useNavigate()
	const [movie, setMovie] = useState<IMovie | null>(null)
	const [movieIndex, setMovieIndex] = useState<number | null>(null)
	const [selectedDate, setSelectedDate] = useState<string>('')

	useEffect(() => {
		if (id) {
			MovieService.fetchMovies().then(res => {
				const foundIndex = res.data.findIndex(m => m._id === id)
				setMovieIndex(foundIndex)

				const min = getMinDate(foundIndex)
				setSelectedDate(min)
			})
			MovieService.getOneMovie(id).then(res => setMovie(res.data))
		}
	}, [id])

	if (!movie || movieIndex === null)
		return <div className={styles.loading}>Loading movie...</div>

	const weekIdx = Math.floor(movieIndex / 3)
	const minDateObj = new Date(startDateUTC.getTime() + weekIdx * msPerWeek)
	const maxDateObj = new Date(minDateObj.getTime() + msPerWeek - 1)
	const minDate = minDateObj.toISOString().split('T')[0]
	const maxDate = maxDateObj.toISOString().split('T')[0]

	const schedule = scheduleMap[movieIndex % 9] || { times: [], halls: [] }
	const selected = new Date(selectedDate)

	const getUserAge = () => {
		if (!store.user.birthdate) return null
		const birth = new Date(store.user.birthdate)
		const today = new Date()
		let age = today.getFullYear() - birth.getFullYear()
		const m = today.getMonth() - birth.getMonth()
		if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
			age--
		}
		return age
	}

	const getRequiredAge = () => {
		const match = String(movie.rating).match(/\d+/)
		return match ? parseInt(match[0]) : 0
	}

	const userAge = getUserAge()
	const requiredAge = getRequiredAge()
	const ageRestricted = userAge !== null && userAge < requiredAge
	const notActivated = !store.user.isActivated
	const bookingRestricted = ageRestricted || notActivated

	return (
		<div className={styles.container}>
			<img src={movie.imageUrl} alt={movie.title} className={styles.poster} />
			<div className={styles.info}>
				<p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
					{formatDate(selected)}
				</p>
				<input
					type='date'
					value={selectedDate}
					min={minDate}
					max={maxDate}
					onChange={e => setSelectedDate(e.target.value)}
					style={{
						marginBottom: '20px',
						fontSize: '16px',
						padding: '6px 10px',
						borderRadius: '6px',
					}}
				/>
				<h2>{movie.title}</h2>
				<div className={styles.tags}>
					<span className={styles.rating}>{movie.rating}</span>
					<span className={styles.format}>{movie.format}</span>
				</div>
				<p style={{ marginTop: '16px', lineHeight: '1.6em' }}>
					{movie.description?.trim() || 'No description available.'}
				</p>
				<h3 style={{ marginTop: '24px' }}>Sessions:</h3>
				<div className={styles.showtimes}>
					{schedule?.times?.map((time: string, i: number) => (
						<div
							key={i}
							className={styles.showtime}
							onClick={() => {
								if (bookingRestricted) return
								navigate(
									`/seats?movieId=${movie._id}&date=${selectedDate}&time=${time}&hall=${schedule.halls[i]}`
								)
							}}
						>
							<strong>{time}</strong>
							<div>Hall {schedule.halls[i]}</div>
						</div>
					))}
				</div>
				{bookingRestricted && (
					<div
						style={{
							marginTop: '20px',
							color: 'orangered',
							fontWeight: 'bold',
							fontSize: '16px',
						}}
					>
						{ageRestricted && (
							<>
								This movie is rated {movie.rating}. You are too young to book
								tickets.
								<br />
							</>
						)}
						{notActivated && (
							<>
								Your email is not verified. Please activate your account via
								email before booking.
							</>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

function getMinDate(movieIndex: number | null) {
	if (movieIndex === null) return ''
	const weekIdx = Math.floor(movieIndex / 3)
	const minDateObj = new Date(startDateUTC.getTime() + weekIdx * msPerWeek)
	return minDateObj.toISOString().split('T')[0]
}
