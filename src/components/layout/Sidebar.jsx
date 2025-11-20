import React, { useState } from 'react';
import { FaColumns, FaChartPie, FaClock, FaCog, FaBolt, FaPlus, FaList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import CreateTaskModal from '../shared/CreateTaskModal';
import useStore from '../../store/useStore';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { username, streak } = useStore();
    const menuItems = [
        { id: 'dashboard', icon: FaChartPie, label: 'Dashboard' },
        { id: 'list', icon: FaList, label: 'List' },
        { id: 'kanban', icon: FaColumns, label: 'Kanban' },
        { id: 'focus', icon: FaClock, label: 'Focus' },
        { id: 'settings', icon: FaCog, label: 'Settings' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="w-20 lg:w-64 h-screen bg-space-800 border-r border-holo-500/20 flex flex-col relative z-20">
                {/* Logo */}
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-holo-500/20">
                    <FaBolt className="text-holo-500 text-2xl lg:mr-3 animate-pulse" />
                    <h1 className="hidden lg:block font-display text-2xl font-bold tracking-widest text-white">
                        TASKNOVA
                    </h1>
                </div>

                {/* New Task Button */}
                <div className="p-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-holo-500/10 border border-holo-500 text-holo-500 hover:bg-holo-500 hover:text-space-900 transition-all duration-300 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-neon"
                    >
                        <FaPlus />
                        <span className="hidden lg:inline">NEW TASK</span>
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex-1 py-8 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 lg:px-8 py-4 transition-all duration-300 relative group ${activeTab === item.id ? 'text-holo-500' : 'text-slate-400 hover:text-holo-300'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1 h-full bg-holo-500 shadow-neon"
                                />
                            )}
                            <item.icon className={`text-xl lg:mr-4 ${activeTab === item.id ? 'drop-shadow-[0_0_5px_rgba(0,217,255,0.8)]' : ''}`} />
                            <span className="hidden lg:block font-sans font-medium tracking-wide">{item.label}</span>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-holo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    ))}
                </nav>

                {/* User Status */}
                <div className="p-4 border-t border-holo-500/20">
                    <div className="bg-space-900/50 p-3 rounded-lg border border-holo-500/30 flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-holo-500 to-neon-purple flex items-center justify-center font-bold text-space-900 text-lg">
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden lg:block ml-3 flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{username}</p>
                            <p className="text-xs text-holo-400">{streak} day streak 🔥</p>
                        </div>
                    </div>
                </div>
            </div>
            <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
};

export default Sidebar;
