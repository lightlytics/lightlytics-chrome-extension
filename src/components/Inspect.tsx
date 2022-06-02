import useContent from "../hooks/useContent";
import { Box, Typography } from "@mui/material";

function Inspect() {
  const { resourceIds, awsAccountId } = useContent();

  return (
    <Box sx={{ "& > :not(style)": { mb: 1 } }}>
      <Typography>Account ID:</Typography>
      {awsAccountId && <Typography>{awsAccountId}</Typography>}
      {!awsAccountId && (
        <Typography color="textSecondary">not found</Typography>
      )}
      {resourceIds.length === 0 && (
        <Typography color="textSecondary" variant="caption">
          AWS resources will appear here when you browse console.aws.amazon.com
        </Typography>
      )}
      {resourceIds.map((id) => (
        <div key={id}>
          <Typography variant="caption">{id}</Typography>
        </div>
      ))}
    </Box>
  );
}

export default Inspect;
