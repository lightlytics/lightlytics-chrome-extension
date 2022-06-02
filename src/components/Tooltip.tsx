import { Typography } from "@mui/material";
import useResource from "../hooks/useResource";

interface ITooltip {
  resourceId: String | null;
}

function Tooltip({ resourceId }: ITooltip) {
  const { resource, loading, error, notFound } = useResource({ resourceId });

  return (
    <div>
      {loading ? (
        <Typography variant="caption">Loading...</Typography>
      ) : error ? (
        <Typography variant="caption" color="error">
          Error
        </Typography>
      ) : notFound ? (
        <Typography variant="caption">Resource not found</Typography>
      ) : (
        <>
          <Typography variant="caption">{resourceId}</Typography>
          <Typography variant="subtitle1">{resource?.display_name}</Typography>
        </>
      )}
    </div>
  );
}

export default Tooltip;
