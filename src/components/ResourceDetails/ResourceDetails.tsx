import { Typography } from '@mui/material'
import useResource from '../../hooks/useResource'
import ResourceViolationsDetails from './ResourceViolationsDetails'
import { Box } from '@mui/material'

interface ResourceDetailsProps {
  resourceId: String | null
}

function ResourceDetails({ resourceId }: ResourceDetailsProps) {
  const { resource, loading, error, notFound } = useResource({ resourceId })

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {loading ? (
        <Typography variant="caption">Loading...</Typography>
      ) : error ? (
        <Typography variant="caption">{error.message || 'Error'}</Typography>
      ) : notFound ? (
        <Typography variant="caption">Resource not found</Typography>
      ) : (
        <>
          <Typography variant="caption">
            {resource?.display_name || resourceId}
          </Typography>
          <ResourceViolationsDetails resourceId={resourceId} />
        </>
      )}
    </Box>
  )
}

export default ResourceDetails
