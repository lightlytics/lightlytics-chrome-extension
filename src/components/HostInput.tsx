import { TextField, TextFieldProps } from '@mui/material'
import { CLIENT_OPTIONS_STORAGE_KEY, LIGHTLYTICS_DEFAULT_HOST } from '../config'
import useStorage from '../hooks/useStorage'

function HostInput({
  size,
  variant,
  disabled,
}: {
  size?: TextFieldProps['size']
  variant?: TextFieldProps['variant']
  disabled?: boolean
}) {
  const [options, setOptions] = useStorage(CLIENT_OPTIONS_STORAGE_KEY, {
    host: LIGHTLYTICS_DEFAULT_HOST,
  })
  return (
    <TextField
      size={size}
      variant={variant}
      disabled={disabled}
      value={options?.host || ''}
      onChange={e =>
        setOptions(
          {
            host: e.target.value,
          },
          { merge: true },
        )
      }
      inputProps={{
        style: {
          textAlign: 'center',
        },
      }}
    />
  )
}

export default HostInput
