import { Typography } from "@mui/material";

const ErrorLabel = ({ error }: { error: string }) => {
  return (
    <Typography variant="caption" color="error">
      {error}
    </Typography>
  );
};

export default ErrorLabel;
