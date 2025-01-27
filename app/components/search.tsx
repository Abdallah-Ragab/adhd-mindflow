import { Input, IconButton, Typography } from '@mui/joy';
import { SearchRounded } from '@mui/icons-material';
export function Search() {
    return <Input
        size="md"
        variant="outlined"
        placeholder="Search tasks"
        startDecorator={<SearchRounded  />}
        endDecorator={<IconButton
            variant="outlined"
            color="neutral"
        >
            <Typography level="title-sm" textColor="text.icon">
                Enter
            </Typography>
        </IconButton>}
        sx={{
            alignSelf: 'center',
            display: {
                // xs: 'none',
                sm: 'flex',
            },
        }} />;
}