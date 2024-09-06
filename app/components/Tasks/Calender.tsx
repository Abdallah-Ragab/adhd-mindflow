'use client';
import { DateCalendar } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Calender() {
    return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
    </LocalizationProvider>
    );
}