import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="flex h-screen bg-space-900 text-white overflow-hidden font-sans selection:bg-holo-500 selection:text-space-900">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-y-auto relative">
                {/* Background Grid Effect */}
                <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-20" />

                <div className="relative z-10 p-6 lg:p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
