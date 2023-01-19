import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { ContextProvider } from './context'
import ExtensionPopup from './components/ExtensionPopup'
import { getClient } from './client'

getClient().then(client => {
  ReactDOM.render(
    <React.StrictMode>
      <ContextProvider client={client}>
        <ExtensionPopup />
      </ContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
  )
})
