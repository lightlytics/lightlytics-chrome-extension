import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { ContextProvider } from './context'
import ExtensionPopup from './components/ExtensionPopup'

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <ExtensionPopup />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
