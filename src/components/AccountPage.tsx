import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Context } from '../index'
import Profile from './Profile'
import LoginForm from './LoginForm'

const AccountPage = () => {
	const { store } = useContext(Context)
	return store.isAuth ? <Profile /> : <LoginForm />
}

export default observer(AccountPage)
