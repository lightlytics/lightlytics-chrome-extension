import { Typography } from '@mui/material'

export function NoAccountFoundMessage({
  awsAccountId,
}: {
  awsAccountId?: string
}) {
  return awsAccountId ? (
    <>
      <Typography>
        Integrate with ({awsAccountId}) to see some insights
      </Typography>
    </>
  ) : (
    <>
      <Typography>Can't find any account on this page</Typography>
    </>
  )
}
