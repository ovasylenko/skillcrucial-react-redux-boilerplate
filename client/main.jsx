import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './config/root'

import './assets/scss/main.scss'

const target = document.getElementById('root')
const root = createRoot(target)

root.render(<App />)
