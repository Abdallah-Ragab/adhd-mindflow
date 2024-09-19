'use client';
import Navigation from "../Navigation";
import LandingRoot from "./LandingRoot";
import SideDrawer from "./SideDrawer";
import * as React from 'react';

export default function LandingRootWithMobileNav({ children }: { children: React.ReactNode }) {
    'use client'

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <>
            {drawerOpen && (
                <SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </SideDrawer>
            )}

            <LandingRoot
                sx={[
                    drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    },
                ]}
            >
                {children}
            </LandingRoot>
        </>
    )
}