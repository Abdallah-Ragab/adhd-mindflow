import { Sheet, Box, BoxProps } from "@mui/joy";

export default function SideDrawer(
    props: BoxProps & { onClose: React.MouseEventHandler<HTMLDivElement> },
  ) {
    const { onClose, ...other } = props;
    return (
      <Box
        {...other}
        sx={[
          { position: 'fixed', zIndex: 1200, width: '100%', height: '100%' },
          ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
        ]}
      >
        <Box
          role="button"
          onClick={onClose}
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: (theme) =>
              `rgba(${theme.vars.palette.neutral.darkChannel} / 0.8)`,
          }}
        />
        <Sheet
          sx={{
            minWidth: 256,
            width: 'max-content',
            height: '100%',
            p: 2,
            boxShadow: 'lg',
            bgcolor: 'background.surface',
          }}
        >
          {other.children}
        </Sheet>
      </Box>
    );
  }