import React from 'react'
import ReactDOM from 'react-dom/client'
import { render } from 'preact'
import { App } from './app.jsx'

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />)
