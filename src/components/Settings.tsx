import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Typography,
} from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { SyntheticEvent, useCallback, useState } from 'react'
import { createAccessToken, setAccessToken } from '../auth'
import useSettings from '../hooks/useSettings'
import { ISettings } from '../types'

function Settings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [settings, setSettings] = useSettings()

  const inputProps = useCallback(
    (attr: keyof ISettings, isBoolean = false) => ({
      [isBoolean ? 'checked' : 'value']: settings?.[attr] || '',
      onChange: (e: SyntheticEvent) => {
        setSettings({
          ...settings,
          [attr]: isBoolean
            ? !settings?.[attr]
            : ((e.target as any).value as string),
        } as ISettings)
      },
    }),
    [setSettings, settings],
  )

  const handleLogin = useCallback(async () => {
    setError(null)
    setLoading(true)
    await createAccessToken()
      .then(accessToken => {
        setAccessToken(accessToken)
      })
      .catch(err => setError(err.message))
    setLoading(false)
  }, [])

  return (
    <Box sx={{ '& > :not(style)': { mb: 1, width: 350 } }}>
      <TextField
        {...inputProps('hostname')}
        size="small"
        variant="outlined"
        placeholder="Hostname"
        InputProps={{
          endAdornment: (
            <FormControlLabel
              control={
                <Checkbox {...inputProps('secured', true)} size="small" />
              }
              label="Secured"
            />
          ),
        }}
      />
      <TextField
        {...inputProps('username')}
        size="small"
        variant="outlined"
        placeholder="Username"
      />
      <TextField
        {...inputProps('password')}
        inputProps={{ type: 'password' }}
        size="small"
        variant="outlined"
        placeholder="Password"
      />
      <div>
        <Button
          disabled={loading}
          startIcon={loading && <CircularProgress size={15} />}
          color="primary"
          onClick={handleLogin}
        >
          Login
        </Button>
        {error && (
          <Typography color="error">{JSON.stringify(error)}</Typography>
        )}
      </div>
    </Box>
  )
}

export default Settings
