import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Popup from './components/Popup'
import ContextProvider from './components/ContextProvider'

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <Popup />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
