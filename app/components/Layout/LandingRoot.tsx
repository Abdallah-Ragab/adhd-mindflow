import { Box, BoxProps } from "@mui/joy";

export default function LandingRoot(props: BoxProps) {
    return (
      <Box
        {...props}
        sx={[
          {
            bgcolor: 'background.appBody',
            display: 'grid',
            gridTemplateColumns:'1fr',
            gridTemplateRows: '64px 1fr',
            minHeight: '100vh',
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
      />
    );
  }