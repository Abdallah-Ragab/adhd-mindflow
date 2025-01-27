import Layout from "../components/Layout";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { Box } from '@mui/joy';


export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <Layout.DashboardRootWithMobileNav>
            <Layout.Header>
                <Header />
            </Layout.Header>
            <Layout.SideNav>
                <Navigation />
            </Layout.SideNav>
            <Layout.Main>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr',
                        md: '1fr',
                        lg: 'minmax(300px, 1fr) fit-content(320px) ',
                    },
                }}  >
                    {children}
                </Box>

            </Layout.Main>
        </Layout.DashboardRootWithMobileNav>
    );
}


