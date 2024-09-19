import Layout from "../components/Layout";
import Header from "../components/Header";
import Navigation from "../components/Navigation";

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
                {children}
            </Layout.Main>
        </Layout.DashboardRootWithMobileNav>
    );
}


