import React from 'react';
import useStore from '../../store/useStore';
import { FaFire, FaCheckCircle, FaTasks } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`holo-card p-6 rounded-2xl border-l-4 ${color}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-slate-400 text-sm uppercase tracking-wider font-bold mb-1">{label}</p>
                <h3 className="text-3xl font-display font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-space-900/50 ${color.replace('border-', 'text-')}`}>
                <Icon className="text-2xl" />
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { tasks, streak, username } = useStore();

    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const pendingTasks = tasks.filter(t => t.status !== 'done').length;
    const totalTasks = tasks.length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2">
                        DASHBOARD
                    </h1>
                    <p className="text-holo-400">Welcome back, {username}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={FaFire}
                    label="Day Streak"
                    value={streak}
                    color="border-neon-pink"
                />
                <StatCard
                    icon={FaCheckCircle}
                    label="Tasks Complete"
                    value={completedTasks}
                    color="border-neon-green"
                />
                <StatCard
                    icon={FaTasks}
                    label="Pending Tasks"
                    value={pendingTasks}
                    color="border-holo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="holo-card p-6 rounded-2xl">
                    <h3 className="font-display font-bold text-xl mb-4 text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {tasks.slice(0, 5).map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-space-900/50 rounded-lg border border-white/5">
                                <span className="text-slate-300 truncate flex-1 mr-4">{task.title}</span>
                                <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${task.status === 'done' ? 'bg-neon-green/20 text-neon-green' : 'bg-holo-500/20 text-holo-500'}`}>
                                    {task.status === 'done' ? 'COMPLETE' : 'ACTIVE'}
                                </span>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-slate-500">No recent activity.</p>}
                    </div>
                </div>

                <div className="holo-card p-6 rounded-2xl bg-gradient-to-br from-space-800 to-space-900">
                    <h3 className="font-display font-bold text-xl mb-4 text-white">Task Overview</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-400">Completion Rate</span>
                                <span className="text-neon-green font-bold">
                                    {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full bg-space-900 rounded-full h-2">
                                <div
                                    className="bg-neon-green h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="text-center p-4 bg-space-900/50 rounded-lg border border-white/5">
                                <p className="text-2xl font-bold text-white">{totalTasks}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Tasks</p>
                            </div>
                            <div className="text-center p-4 bg-space-900/50 rounded-lg border border-white/5">
                                <p className="text-2xl font-bold text-holo-500">{streak}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Day Streak</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
