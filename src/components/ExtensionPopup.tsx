import { styled } from '@mui/material'
import useSession from '../hooks/useSession'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import UserDetails from './UserDetails'

import image from '../assets/lightlytics.png'
import HostInput from './HostInput'

function ExtensionPopup() {
  const [session] = useSession()

  return (
    <Container>
      <Backdrop />
      <Frontdrop>
        {session ? (
          <>
            <HostInput variant="standard" size="small" disabled />
            <UserDetails />
            <LogoutButton />
          </>
        ) : (
          <>
            <HostInput />
            <LoginButton />
          </>
        )}
      </Frontdrop>
    </Container>
  )
}

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  backgroundImage: `url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: 300,
  height: 300,
}))

const Frontdrop = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}))

const Backdrop = styled('div')(({ theme }) => ({
  background: `radial-gradient(rgb(255, 255, 255), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}))

export default ExtensionPopup
