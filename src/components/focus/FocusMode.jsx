import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import useStore from '../../store/useStore';
import { FaPlay, FaPause, FaStop, FaTrophy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const FocusMode = () => {
    const { tasks, addXp } = useStore();
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState('');

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((timeLeft) => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            addXp(500); // Bonus XP
            toast.success("Focus Session Complete! +500 XP", {
                icon: '🏆',
                style: {
                    background: '#050b14',
                    color: '#00d9ff',
                    border: '1px solid #00d9ff',
                },
            });
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, addXp]);

    const toggleTimer = () => {
        if (!selectedTaskId && !isActive) {
            toast.error("Select a task to focus on!");
            return;
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const percentage = (timeLeft / (25 * 60)) * 100;

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-space-800/50 p-8 rounded-3xl border border-holo-500/30 backdrop-blur-md shadow-neon relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-holo-500/10 rounded-full blur-3xl pointer-events-none" />

                <h2 className="text-2xl font-display font-bold text-center mb-8 text-white tracking-widest">
                    FOCUS MODE
                </h2>

                <div className="mb-8 relative z-10">
                    <select
                        value={selectedTaskId}
                        onChange={(e) => setSelectedTaskId(e.target.value)}
                        className="w-full bg-space-900 border border-holo-500/50 rounded-xl px-4 py-3 text-holo-50 focus:outline-none focus:shadow-neon transition-shadow"
                        disabled={isActive}
                    >
                        <option value="">Select a Task...</option>
                        {tasks.filter(t => !t.completed).map(task => (
                            <option key={task.id} value={task.id}>{task.title}</option>
                        ))}
                    </select>
                </div>

                <div className="w-64 h-64 mx-auto mb-8 relative z-10">
                    <CircularProgressbar
                        value={percentage}
                        text={formatTime(timeLeft)}
                        styles={buildStyles({
                            textColor: '#fff',
                            pathColor: '#00d9ff',
                            trailColor: 'rgba(0, 217, 255, 0.1)',
                            textSize: '16px',
                            pathTransitionDuration: 0.5,
                        })}
                    />
                </div>

                <div className="flex justify-center gap-4 relative z-10">
                    <button
                        onClick={toggleTimer}
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${isActive
                            ? 'bg-neon-pink text-white shadow-neon-pink hover:bg-pink-600'
                            : 'bg-holo-500 text-space-900 shadow-neon hover:bg-holo-400'
                            }`}
                    >
                        {isActive ? <FaPause /> : <FaPlay className="ml-1" />}
                    </button>
                    <button
                        onClick={resetTimer}
                        className="w-16 h-16 rounded-full bg-space-700 text-slate-300 flex items-center justify-center text-xl hover:bg-space-600 hover:text-white transition-colors border border-slate-600"
                    >
                        <FaStop />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;
