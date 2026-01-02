import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                <div className="container">
                    {children || <Outlet />}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}

export default Layout;
