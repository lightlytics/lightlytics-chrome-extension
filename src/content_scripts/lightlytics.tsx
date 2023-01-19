import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import assert from 'assert'
import ReactDOM from 'react-dom'
import { Session, User } from '../client'
import {
  SESSION_POLLING,
  SESSION_STORAGE_KEY,
  URL_SEARCH_LOGIN_PARAM,
  USER_STORAGE_KEY,
} from '../config'

const params = new URLSearchParams(window.location.search)

let interval: ReturnType<typeof setInterval>

const extLogin =
  params.get(URL_SEARCH_LOGIN_PARAM) ||
  window.localStorage.getItem(URL_SEARCH_LOGIN_PARAM)

if (extLogin) {
  window.localStorage.setItem(URL_SEARCH_LOGIN_PARAM, '1')
  startPolling()
}

function poll() {
  const session = getSession()
  if (session) {
    const user = getUser()
    chrome.storage.local.set({
      [SESSION_STORAGE_KEY]: session,
      [USER_STORAGE_KEY]: user,
    })
    window.localStorage.removeItem(URL_SEARCH_LOGIN_PARAM)
    clearInterval(interval)
    openConfirm()

    return true
  }
}

function openConfirm() {
  const div = document.createElement('div')

  document.body.appendChild(div)

  ReactDOM.render(<ConfirmDialog />, div)
}

function ConfirmDialog() {
  return (
    <Dialog open BackdropProps={{ style: { background: 'black' } }}>
      <DialogTitle>Login complete</DialogTitle>
      <DialogContent>
        <Typography>Lighlytics Chrome Extension finished login.</Typography>
      </DialogContent>
      <DialogActions>
        <Button href="/">Close</Button>
      </DialogActions>
    </Dialog>
  )
}

function startPolling() {
  if (!poll()) {
    interval = setInterval(poll, SESSION_POLLING)
  }
}

function getSession() {
  const sessionItem = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (!sessionItem) {
    return null
  }
  try {
    const session = JSON.parse(sessionItem) as Session

    assert(session.access_token, 'Missing access token')
    assert(session.refresh_token, 'Missing refresh token')

    return session
  } catch (err) {
    console.error(`Error parsing session ${err}`)
  }
}

function getUser() {
  const userItem = window.localStorage.getItem(USER_STORAGE_KEY)
  if (!userItem) {
    return null
  }
  try {
    const user = JSON.parse(userItem) as User

    assert(user._id, 'Missing user id')

    return user
  } catch (err) {
    console.error(`Error parsing session ${err}`)
  }
}

export {}
