import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import Store from './store/store'
import { createContext } from 'react'
import { BrowserRouter } from 'react-router-dom'

const store = new Store()

export const Context = createContext({
	store,
})

const container = document.getElementById('root')
if (!container) throw new Error('Root container missing in index.html')

const root = ReactDOM.createRoot(container)

root.render(
	<React.StrictMode>
		<Context.Provider value={{ store }}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Context.Provider>
	</React.StrictMode>
)
