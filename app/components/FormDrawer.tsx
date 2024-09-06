'use client';

import { Box, Button, Drawer } from "@mui/joy";
import React from "react";
import Task from "./Tasks";

export default function FormDrawer() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setOpen(inOpen);
    };

    return (
        <>
        <Box sx={{ display: 'flex' }}>
            <Button variant="outlined" color="neutral" onClick={toggleDrawer(true)}>
                Open drawer
            </Button>
            <Drawer open={open} anchor="right" onClose={toggleDrawer(false)} size='md'>
                <Task.Form />
            </Drawer>
        </Box>
        </>
    )
}