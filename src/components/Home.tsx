import { FC, useEffect, useState } from 'react'
import { ImageSlider } from './ImageSlider'
import styles from './Home.module.css'
import movie1 from '../assets/images/movie-1.jpg'
import movie2 from '../assets/images/movie-2.jpg'
import movie3 from '../assets/images/movie-3.jpg'
import movie4 from '../assets/images/movie-4.jpg'
import movie5 from '../assets/images/movie-5.jpg'

import { IMovie } from '../models/IMovie'
import MovieService from '../services/MovieService'

const IMAGES = [movie1, movie2, movie3, movie4, movie5]

const getActiveMovieIndexes = (date: Date): number[] => {
	const startDateUTC = new Date(Date.UTC(2025, 5, 9, 21, 0, 0))
	const diffWeeks = Math.floor(
		(+date - +startDateUTC) / (7 * 24 * 60 * 60 * 1000)
	)
	const base = (diffWeeks * 3) % 9
	return [base, (base + 1) % 9, (base + 2) % 9]
}

const Home: FC = () => {
	const [movies, setMovies] = useState<IMovie[]>([])

	useEffect(() => {
		MovieService.fetchMovies().then(res => {
			const indexes = getActiveMovieIndexes(new Date())
			const currentMovies = indexes.map(i => res.data[i]).filter(Boolean)
			setMovies(currentMovies)
		})
	}, [])

	return (
		<div className={styles.homePage}>
			<div
				style={{
					maxWidth: '1200px',
					width: '100%',
					aspectRatio: '10/6',
					margin: '20px auto',
				}}
			>
				<ImageSlider imageUrls={IMAGES} />
			</div>

			<h2 className={styles.weeklyHeading}>Now Showing</h2>
			<div className={styles.grid}>
				{movies.map(movie => (
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

export default Home
