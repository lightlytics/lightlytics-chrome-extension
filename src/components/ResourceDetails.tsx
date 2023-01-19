import { Typography } from '@mui/material'
import useResource from '../hooks/useResource'
import { Box } from '@mui/system'
import useViolations from '../hooks/useViolations'

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

interface ResourceViolationsDetailsProps {
  resourceId: String | null
}

function ResourceViolationsDetails({
  resourceId,
}: ResourceViolationsDetailsProps) {
  const { violations, loading, error } = useViolations({ resourceId })

  return (
    <>
      {loading ? (
        <Typography variant="caption">Loading...</Typography>
      ) : error ? (
        <Typography variant="caption">{error.message || 'Error'}</Typography>
      ) : violations?.length === 0 ? (
        <Typography>No Violations</Typography>
      ) : (
        <>
          <Typography variant="subtitle2">Violations</Typography>
          <div>
            {violations?.map(
              ({ severity, count }: { severity: number; count: number }) => (
                <Violation severity={severity} count={count} />
              ),
            )}
          </div>
        </>
      )}
    </>
  )
}

function Violation({ severity, count }: { severity: number; count: number }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <SeverityIcon severity={severity} />
      <SeverityLabel severity={severity} />
      <Typography>({count})</Typography>
    </Box>
  )
}

function SeverityIcon({ severity }: { severity: number }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: 2,
        background: {
          1: 'gray',
          2: 'yellow',
          3: 'orange',
          4: 'red',
        }[severity],
      }}
    />
  )
}

function SeverityLabel({ severity }: { severity: number }) {
  return (
    <Typography>
      {
        {
          1: 'Low',
          2: 'Medium',
          3: 'High',
          4: 'Critical',
        }[severity]
      }
    </Typography>
  )
}

export default ResourceDetails
