import React, { FC, useEffect, useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { Context } from './index'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './components/Home'
import FoodPage from './components/FoodPage'
import { MoviesPage } from './components/MoviesPage'
import { MoviePage } from './components/MoviePage'

import SeatSelection from './components/SeatSelection'
import AccountPage from './components/AccountPage'
import SchedulePage from './components/SchedulePage'
import AboutUs from './components/AboutUs'

import styles from './App.module.css'

const App: FC = observer(() => {
	const { store } = useContext(Context)

	useEffect(() => {
		if (localStorage.getItem('token')) {
			store.checkAuth()
		}
	}, [])

	return (
		<div className={styles.app}>
			<Navbar />
			<div className={styles.main}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/food' element={<FoodPage />} />
					<Route path='/movies' element={<MoviesPage />} />
					<Route path='/movie/:id' element={<MoviePage />} />
					<Route path='/seats' element={<SeatSelection />} />
					<Route path='/account' element={<AccountPage />} />
					<Route path='/schedule' element={<SchedulePage />} />
					<Route path='/about' element={<AboutUs />} />
				</Routes>
			</div>
			<Footer />
		</div>
	)
})

export default App
