import { Button } from '@mui/material'
import { URL_SEARCH_LOGIN_PARAM } from '../config'
import useClientOptions from '../hooks/useClientOptions'

function LoginButton() {
  const [options] = useClientOptions()

  return (
    <Button
      variant="contained"
      disabled={!options?.host}
      href={`https://${options?.host}/login?${URL_SEARCH_LOGIN_PARAM}=1`}
      target="_blank"
    >
      Login
    </Button>
  )
}

export default LoginButton
