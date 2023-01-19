import { Typography } from '@mui/material'
import useCurrentUser from '../hooks/useCurrentUser'

function UserDetails() {
  const user = useUserDetails()

  return <Typography>Hello, {user?.full_name}</Typography>
}

function useUserDetails() {
  const [user] = useCurrentUser()

  return user
}

export default UserDetails
