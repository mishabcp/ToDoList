import React, { useState } from 'react';
import { FaPlus, FaCheck, FaTimes, FaCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SubtaskList = ({ subtasks = [], onAdd, onToggle, onDelete, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        const title = inputValue.trim();
        if (title) {
            onAdd({ title });
            setInputValue('');
            setIsAdding(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        } else if (e.key === 'Escape') {
            setInputValue('');
            setIsAdding(false);
        }
    };

    const completedCount = subtasks.filter(st => st.completed).length;
    const totalCount = subtasks.length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="block text-sm text-holo-400 uppercase tracking-wider font-bold">
                    Subtasks
                </label>
                {totalCount > 0 && (
                    <span className="text-xs text-slate-400">
                        {completedCount}/{totalCount} completed
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {totalCount > 0 && (
                <div className="w-full bg-space-900 rounded-full h-1.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedCount / totalCount) * 100}%` }}
                        className="bg-gradient-to-r from-holo-500 to-neon-purple h-1.5 rounded-full"
                        transition={{ duration: 0.3 }}
                    />
                </div>
            )}

            {/* Subtask List */}
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                <AnimatePresence>
                    {subtasks.map((subtask) => (
                        <motion.div
                            key={subtask.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`
                                flex items-center gap-3 p-2 rounded-lg
                                bg-space-900/50 border border-slate-700/50
                                hover:border-holo-500/30 transition-all
                                ${subtask.completed ? 'opacity-60' : ''}
                            `}
                        >
                            <button
                                type="button"
                                onClick={() => !disabled && onToggle(subtask.id)}
                                disabled={disabled}
                                className={`
                                    flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
                                    transition-all
                                    ${subtask.completed
                                        ? 'bg-holo-500 border-holo-500'
                                        : 'border-slate-600 hover:border-holo-500'
                                    }
                                    ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                                `}
                            >
                                {subtask.completed && <FaCheck className="text-space-900 text-xs" />}
                            </button>

                            <span className={`
                                flex-1 text-sm text-slate-300
                                ${subtask.completed ? 'line-through text-slate-500' : ''}
                            `}>
                                {subtask.title}
                            </span>

                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(subtask.id)}
                                    className="
                                        flex-shrink-0 text-slate-500 hover:text-red-400
                                        transition-colors opacity-0 group-hover:opacity-100
                                    "
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Subtask Input */}
            {!disabled && (
                <div className="pt-2">
                    {isAdding ? (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2"
                        >
                            <FaCircle className="text-slate-600 text-xs flex-shrink-0" />
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={() => {
                                    if (!inputValue.trim()) setIsAdding(false);
                                }}
                                placeholder="Subtask title..."
                                autoFocus
                                className="
                                    flex-1 bg-space-900 border border-holo-500/30 rounded-lg
                                    px-3 py-2 text-sm text-white
                                    focus:border-holo-500 focus:shadow-neon outline-none
                                "
                            />
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="
                                    px-3 py-2 rounded-lg bg-holo-500 text-space-900
                                    hover:bg-holo-400 transition-colors font-medium text-sm
                                "
                            >
                                Add
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            type="button"
                            onClick={() => setIsAdding(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="
                                w-full flex items-center gap-2 px-3 py-2 rounded-lg
                                bg-space-900/50 border border-dashed border-holo-500/30
                                text-holo-400 hover:border-holo-500 hover:text-holo-300
                                transition-all text-sm
                            "
                        >
                            <FaPlus className="text-xs" />
                            Add Subtask
                        </motion.button>
                    )}
                </div>
            )}
        </div>
    );
};

export default SubtaskList;
