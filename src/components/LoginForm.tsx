import React, { FC, useState, useContext } from 'react'
import { Context } from '../index'
import { observer } from 'mobx-react-lite'
import styles from './LoginForm.module.css'

const getMaxDate = (minAge: number) => {
	const now = new Date()
	now.setFullYear(now.getFullYear() - minAge)
	return now.toISOString().split('T')[0]
}

const LoginForm: FC = () => {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const { store } = useContext(Context)
	const [error, setError] = useState<string>('')
	const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({})
	const [isLogin, setIsLogin] = useState(true)
	const [birthdate, setBirthdate] = useState('')

	const handleLogin = async () => {
		setError('')
		setFieldErrors({})
		try {
			await store.login(email, password)
		} catch (e: any) {
			const msg =
				e.response?.data?.errors?.[0]?.msg ||
				e.response?.data?.message ||
				'Login failed'
			setError(msg)
		}
	}

	const handleRegister = async () => {
		setError('')
		setFieldErrors({})
		try {
			await store.registration(email, password, birthdate)
		} catch (e: any) {
			if (e.response?.data?.errors?.length) {
				const errorsObj: { [key: string]: string } = {}
				e.response.data.errors.forEach((err: any) => {
					errorsObj[err.param] = err.msg
				})
				setFieldErrors(errorsObj)
			}
			const msg =
				e.response?.data?.errors?.[0]?.msg ||
				e.response?.data?.message ||
				'Registration failed'
			setError(msg)
		}
	}

	return (
		<div className={styles.loginContainer}>
			<h2>{isLogin ? 'Login' : 'Register'}</h2>

			<input
				className={styles.loginInput}
				type='text'
				placeholder='Email'
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			{fieldErrors.email && (
				<div className={styles.loginError}>{fieldErrors.email}</div>
			)}

			<input
				className={styles.loginInput}
				type='password'
				placeholder='Password'
				value={password}
				onChange={e => setPassword(e.target.value)}
			/>
			{fieldErrors.password && (
				<div className={styles.loginError}>{fieldErrors.password}</div>
			)}

			{!isLogin && (
				<>
					<input
						className={styles.loginInput}
						type='date'
						value={birthdate}
						onChange={e => setBirthdate(e.target.value)}
						max={getMaxDate(10)}
					/>
					{fieldErrors.birthdate && (
						<div className={styles.loginError}>{fieldErrors.birthdate}</div>
					)}
				</>
			)}

			{error && <div className={styles.loginError}>{error}</div>}

			<div className={styles.loginButtons}>
				<button
					onClick={() => {
						if (isLogin) handleLogin()
						else handleRegister()
					}}
				>
					{isLogin ? 'Log in' : 'Register'}
				</button>
			</div>

			<span
				className={styles.switchMode}
				onClick={() => {
					setIsLogin(!isLogin)
					setError('')
					setFieldErrors({})
				}}
			>
				{isLogin ? 'No account? Register' : 'Have an account? Log in'}
			</span>
		</div>
	)
}

export default observer(LoginForm)
