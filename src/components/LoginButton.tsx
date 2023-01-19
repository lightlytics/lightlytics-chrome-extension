import { Button } from '@mui/material'
import { LIGHTLYTICS_HOST_URL, URL_SEARCH_LOGIN_PARAM } from '../config'

function LoginButton() {
  return (
    <Button
      variant="contained"
      href={`${LIGHTLYTICS_HOST_URL}/login?${URL_SEARCH_LOGIN_PARAM}=1`}
      target="_blank"
    >
      Login
    </Button>
  )
}

export default LoginButton
