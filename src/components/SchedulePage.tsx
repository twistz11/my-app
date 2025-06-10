import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieService from '../services/MovieService'
import { IMovie } from '../models/IMovie'
import styles from './SchedulePage.module.css'
import { getHallForMovie } from '../utils/getHall'
import {
	startDateUTC,
	getWeekRange,
	getActiveMovieIndexes,
} from '../utils/scheduleHelpers'

const msPerWeek = 7 * 24 * 60 * 60 * 1000

const times = ['16:00', '18:40', '20:40']

const formatDateInput = (d: Date) => d.toISOString().split('T')[0]

const SchedulePage = () => {
	const [movies, setMovies] = useState<IMovie[]>([])
	const [weekOffset, setWeekOffset] = useState(0)
	const [allMovies, setAllMovies] = useState<IMovie[]>([])
	const [error, setError] = useState('')
	const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()))
	const navigate = useNavigate()

	useEffect(() => {
		if (selectedDate) {
			const dateObj = new Date(selectedDate)
			const diff = dateObj.getTime() - startDateUTC.getTime()
			const calcOffset = Math.floor(diff / msPerWeek)
			setWeekOffset(calcOffset)
		}
	}, [selectedDate])

	useEffect(() => {
		MovieService.fetchMovies()
			.then(res => {
				if (!res.data || res.data.length === 0) {
					setError('No movies found.')
					return
				}
				setAllMovies(res.data)
			})
			.catch(() => {
				setError('Failed to fetch movies. Make sure you are logged in.')
			})
	}, [])

	useEffect(() => {
		if (allMovies.length === 0) return
		const indexes = getActiveMovieIndexes(weekOffset)
		const current = indexes.map(i => allMovies[i % allMovies.length])
		setMovies(current)
	}, [weekOffset, allMovies])

	const handleNavigate = (movieId: string, time: string, hall: string) => {
		navigate(
			`/seats?movieId=${movieId}&date=${selectedDate}&time=${time}&hall=${hall}`
		)
	}

	const dateMin = formatDateInput(startDateUTC)
	const dateMax = formatDateInput(
		new Date(startDateUTC.getTime() + 60 * msPerWeek)
	)

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>Weekly Schedule</h2>

			<div className={styles.weekControl}>
				<button
					onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
					disabled={weekOffset <= 0}
				>
					← Previous
				</button>

				<span>{getWeekRange(weekOffset)}</span>
				<button onClick={() => setWeekOffset(w => w + 1)}>Next →</button>
			</div>

			<div
				style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}
			>
				<label style={{ fontWeight: 500, marginRight: 8 }}>
					Choose a date:
				</label>
				<input
					type='date'
					value={selectedDate}
					min={dateMin}
					max={dateMax}
					onChange={e => setSelectedDate(e.target.value)}
					style={{ fontSize: 16, padding: 4, borderRadius: 6 }}
				/>
			</div>

			{error && <p style={{ color: 'tomato', fontWeight: 'bold' }}>{error}</p>}

			<div className={styles.grid}>
				{movies.map((movie, index) => (
					<div key={movie._id} className={styles.card}>
						<img
							src={movie.imageUrl}
							alt={movie.title}
							className={styles.poster}
						/>
						<div className={styles.details}>
							<h3>{movie.title}</h3>
							<p>
								{movie.rating} | {movie.format}
							</p>
							<p style={{ margin: '10px 0' }}>Shows:</p>
							<div className={styles.sessions}>
								{times.map((time, i) => {
									const hall = getHallForMovie(index, time)
									return (
										<button
											key={`${movie._id}-${time}`}
											onClick={() => handleNavigate(movie._id, time, hall)}
											className={styles.sessionBtn}
										>
											{time} <span>Hall #{hall}</span>
										</button>
									)
								})}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default SchedulePage
