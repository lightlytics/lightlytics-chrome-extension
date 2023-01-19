import { Button } from '@mui/material'
import { SESSION_STORAGE_KEY } from '../config'
import useStorage from '../hooks/useStorage'

function LogoutButton() {
  const [, , remove] = useStorage(SESSION_STORAGE_KEY)
  return (
    <Button variant="contained" color="error" onClick={remove}>
      Logout
    </Button>
  )
}

export default LogoutButton
