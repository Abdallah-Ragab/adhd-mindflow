'use client';
import Navigation from "../Navigation";
import DashboardRoot from "./DashboardRoot";
import SideDrawer from "./SideDrawer";
import * as React from 'react';

export default function DashboardRootWithMobileNav({ children }: { children: React.ReactNode }) {
    'use client'

    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
        <>
            {drawerOpen && (
                <SideDrawer onClose={() => setDrawerOpen(false)}>
                    <Navigation />
                </SideDrawer>
            )}

            <DashboardRoot
                sx={[
                    drawerOpen && {
                        height: '100vh',
                        overflow: 'hidden',
                    },
                ]}
            >
                {children}
            </DashboardRoot>
        </>
    )
}