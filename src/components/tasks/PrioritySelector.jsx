import React from 'react';
import { FaFlag } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PrioritySelector = ({ value, onChange, disabled = false }) => {
    const priorities = [
        { value: 'low', label: 'Low', color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500' },
        { value: 'medium', label: 'Medium', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500' },
        { value: 'high', label: 'High', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500' },
    ];

    return (
        <div className="flex gap-2">
            {priorities.map((priority) => (
                <motion.button
                    key={priority.value}
                    type="button"
                    onClick={() => !disabled && onChange(priority.value)}
                    disabled={disabled}
                    whileHover={{ scale: disabled ? 1 : 1.05 }}
                    whileTap={{ scale: disabled ? 1 : 0.95 }}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                        ${value === priority.value
                            ? `${priority.bgColor} ${priority.borderColor} ${priority.color}`
                            : 'bg-space-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    <FaFlag className={value === priority.value ? priority.color : 'text-slate-500'} />
                    <span className="text-sm font-medium">{priority.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default PrioritySelector;
