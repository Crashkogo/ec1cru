import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { NotificationProvider } from '../context/NotificationContext';
import Notification from './Notification';
import ScrollToTop from './ScrollToTop';
import ScrollToTopOnRouteChange from './ScrollToTopOnRouteChange';

interface LayoutProps {
    children: React.ReactNode;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const Layout: React.FC<LayoutProps> = ({ children, setShowLogin }) => {
    return (
        <NotificationProvider>
            <div className="min-h-screen flex flex-col">
                <Header setShowLogin={setShowLogin} />
                <main className="flex-1 pt-20">
                    {children}
                </main>
                <Footer />
                <Notification />
                <ScrollToTop />
                <ScrollToTopOnRouteChange />
            </div>
        </NotificationProvider>
    );
};

export default Layout;
 