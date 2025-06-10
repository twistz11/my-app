import { useEffect, useState } from 'react'
import MovieService from '../services/MovieService'
import { IMovie } from '../models/IMovie'
import styles from './MoviesPage.module.css'
import { useNavigate } from 'react-router-dom'
import { AxiosResponse } from 'axios'
import { getActiveMovieIndexes } from '../utils/scheduleHelpers'

export const MoviesPage = () => {
	const [activeMovies, setActiveMovies] = useState<IMovie[]>([])
	const [upcomingMovies, setUpcomingMovies] = useState<IMovie[]>([])
	const [allMovies, setAllMovies] = useState<IMovie[]>([])

	const navigate = useNavigate()

	useEffect(() => {
		MovieService.fetchMovies().then((res: AxiosResponse<IMovie[]>) => {
			const movies = res.data
			setAllMovies(movies)

			const activeIndexes = getActiveMovieIndexes()
			const active = activeIndexes.map(i => movies[i]).filter(Boolean)
			const upcoming = movies.filter(m => !active.includes(m))

			setActiveMovies(active)
			setUpcomingMovies(upcoming)
		})
	}, [])

	return (
		<div className={styles.container}>
			<h2 className={styles.heading}>Available This Week</h2>
			<div className={styles.grid}>
				{activeMovies.length === 0 && (
					<p style={{ color: 'tomato', fontWeight: 'bold' }}>
						No movies available this week.
					</p>
				)}
				{activeMovies.map(movie => (
					<div key={movie._id} className={styles.card}>
						<img
							src={movie.imageUrl}
							alt={movie.title}
							className={styles.poster}
						/>
						<h3>{movie.title}</h3>
						<p>
							{movie.rating} | {movie.format}
						</p>
						<button
							className={styles.button}
							onClick={() => navigate(`/movie/${movie._id}`)}
						>
							Buy Ticket
						</button>
					</div>
				))}
			</div>

			<h2 className={styles.heading}>Coming Soon</h2>
			<div className={styles.grid}>
				{upcomingMovies.map(movie => (
					<div key={movie._id} className={styles.card}>
						<img
							src={movie.imageUrl}
							alt={movie.title}
							className={styles.poster}
						/>
						<h3>{movie.title}</h3>
						<p>
							{movie.rating} | {movie.format}
						</p>
					</div>
				))}
			</div>
		</div>
	)
}
