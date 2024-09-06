import { Input, IconButton, Typography } from '@mui/joy';
import { SearchRounded } from '@mui/icons-material';
export function Search() {
    return <Input
        size="sm"
        variant="outlined"
        placeholder="Search anything…"
        startDecorator={<SearchRounded color="primary" />}
        endDecorator={<IconButton
            variant="outlined"
            color="neutral"
        >
            <Typography level="title-sm" textColor="text.icon">
                ⌘ K
            </Typography>
        </IconButton>}
        sx={{
            alignSelf: 'center',
            display: {
                xs: 'none',
                sm: 'flex',
            },
        }} />;
}