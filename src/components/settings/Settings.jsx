import React, { useState } from 'react';
import { FaSave, FaTrash, FaFileExport, FaFileImport, FaUser, FaFire, FaTasks, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../shared/ConfirmationModal';

const Settings = () => {
    const { username, setUsername, tasks, streak, clearAllTasks, exportTasks, importTasks } = useStore();
    const [editedUsername, setEditedUsername] = useState(username);
    const [isEditing, setIsEditing] = useState(false);

    // Confirmation Modal State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleSaveUsername = () => {
        if (editedUsername.trim()) {
            setUsername(editedUsername.trim());
            setIsEditing(false);
            toast.success('Username updated!');
        } else {
            toast.error('Username cannot be empty');
        }
    };

    const handleClearAllClick = () => {
        setIsConfirmOpen(true);
    };

    const confirmClearAll = () => {
        clearAllTasks();
        toast.success('All tasks cleared');
    };

    const handleExport = () => {
        exportTasks();
        toast.success('Tasks exported successfully');
    };

    const handleImport = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const tasks = JSON.parse(e.target.result);
                if (Array.isArray(tasks)) {
                    importTasks(tasks);
                    toast.success(`Imported ${tasks.length} tasks`);
                } else {
                    toast.error('Invalid file format');
                }
            } catch (error) {
                toast.error('Failed to import tasks');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;

    return (
        <div className="space-y-8 max-w-4xl">
            <div>
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                    SETTINGS
                </h1>
                <p className="text-holo-400">Manage your profile and data</p>
            </div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="holo-card p-6 rounded-2xl"
            >
                <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <FaUser className="text-holo-500" />
                    Profile
                </h2>

                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-holo-500 to-neon-purple flex items-center justify-center font-bold text-space-900 text-3xl">
                        {username.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm text-holo-400 mb-2 uppercase tracking-wider font-bold">
                            Username
                        </label>
                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={editedUsername}
                                    onChange={(e) => setEditedUsername(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveUsername()}
                                    className="flex-1 bg-space-900 border border-holo-500/30 rounded-lg px-4 py-2 text-white focus:border-holo-500 focus:shadow-neon outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSaveUsername}
                                    className="px-4 py-2 bg-holo-500 text-space-900 rounded-lg hover:bg-holo-400 transition-colors font-bold flex items-center gap-2"
                                >
                                    <FaSave /> Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditedUsername(username);
                                        setIsEditing(false);
                                    }}
                                    className="px-4 py-2 bg-space-900 text-slate-400 rounded-lg hover:text-white border border-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-white text-lg font-semibold">{username}</span>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-sm text-holo-500 hover:text-holo-400 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Statistics Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="holo-card p-6 rounded-2xl"
            >
                <h2 className="text-xl font-display font-bold text-white mb-6">
                    Statistics
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-space-900/50 p-4 rounded-lg border border-white/5 text-center">
                        <FaTasks className="text-3xl text-holo-500 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{totalTasks}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Tasks</p>
                    </div>
                    <div className="bg-space-900/50 p-4 rounded-lg border border-white/5 text-center">
                        <FaCheckCircle className="text-3xl text-neon-green mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{completedTasks}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Completed</p>
                    </div>
                    <div className="bg-space-900/50 p-4 rounded-lg border border-white/5 text-center">
                        <FaFire className="text-3xl text-neon-pink mx-auto mb-2" />
                        <p className="text-2xl font-bold text-white">{streak}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Day Streak</p>
                    </div>
                </div>
            </motion.div>

            {/* Data Management Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="holo-card p-6 rounded-2xl"
            >
                <h2 className="text-xl font-display font-bold text-white mb-6">
                    Data Management
                </h2>

                <div className="space-y-4">
                    {/* Export Tasks */}
                    <div className="flex items-center justify-between p-4 bg-space-900/50 rounded-lg border border-white/5">
                        <div>
                            <h3 className="text-white font-semibold mb-1">Export Tasks</h3>
                            <p className="text-sm text-slate-400">Download all your tasks as JSON</p>
                        </div>
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-holo-500/10 border border-holo-500 text-holo-500 rounded-lg hover:bg-holo-500 hover:text-space-900 transition-all font-bold flex items-center gap-2"
                        >
                            <FaFileExport /> Export
                        </button>
                    </div>

                    {/* Import Tasks */}
                    <div className="flex items-center justify-between p-4 bg-space-900/50 rounded-lg border border-white/5">
                        <div>
                            <h3 className="text-white font-semibold mb-1">Import Tasks</h3>
                            <p className="text-sm text-slate-400">Load tasks from a JSON file</p>
                        </div>
                        <label className="px-4 py-2 bg-holo-500/10 border border-holo-500 text-holo-500 rounded-lg hover:bg-holo-500 hover:text-space-900 transition-all font-bold flex items-center gap-2 cursor-pointer">
                            <FaFileImport /> Import
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Clear All Tasks */}
                    <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/30">
                        <div>
                            <h3 className="text-white font-semibold mb-1">Clear All Tasks</h3>
                            <p className="text-sm text-slate-400">Permanently delete all tasks</p>
                        </div>
                        <button
                            onClick={handleClearAllClick}
                            className="px-4 py-2 bg-red-500/10 border border-red-500 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold flex items-center gap-2"
                        >
                            <FaTrash /> Clear All
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* App Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-slate-500 text-sm"
            >
                <p>TaskNova v1.0</p>
                <p className="mt-1">Built with React + Zustand</p>
            </motion.div>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmClearAll}
                title="Clear All Tasks"
                message="Are you sure you want to delete ALL tasks? This action cannot be undone."
                confirmLabel="Clear All"
                isDanger={true}
            />
        </div>
    );
};

export default Settings;
