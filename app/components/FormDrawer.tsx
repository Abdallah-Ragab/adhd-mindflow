// 'use client';

import { Box, Button, Drawer } from "@mui/joy";
import React from "react";
import Task from "./tasks";

export default function FormDrawer({state}: {state:[boolean, (state:boolean)=>void]}) {
    const [open, setOpen] = state;

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
            <Drawer open={open} anchor="right" onClose={setOpen(false)} size='md'>
                <Task.Form />
            </Drawer>
        </Box>
        </>
    )
}