'use client';
import Navigation from "../Navigation";
import Root from "./Root";
import SideDrawer from "./SideDrawer";
import * as React from 'react';

export default function RootWithMobileNav({ children }: { children: React.ReactNode }) {
    'use client'

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <>
            {drawerOpen && (
                <SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </SideDrawer>
            )}

            <Root
                sx={[
                    drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    },
                ]}
            >
                {children}
            </Root>
        </>
    )
}