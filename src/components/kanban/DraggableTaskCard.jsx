import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FaClock, FaTag, FaFlag, FaCheckCircle } from 'react-icons/fa';

const DraggableTaskCard = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const categoryColors = {
        personal: 'text-neon-pink border-neon-pink/50',
        work: 'text-holo-500 border-holo-500/50',
        shopping: 'text-neon-green border-neon-green/50',
        health: 'text-purple-400 border-purple-400/50',
        learning: 'text-cyan-400 border-cyan-400/50',
        other: 'text-slate-400 border-slate-400/50',
    };

    const priorityConfig = {
        high: { color: 'text-red-400 bg-red-500/10 border-red-500/30', label: 'High' },
        medium: { color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', label: 'Med' },
        low: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', label: 'Low' },
    };

    const priority = task.priority || 'medium';
    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                holo-card p-4 rounded-xl mb-3 cursor-grab active:cursor-grabbing 
                hover:shadow-neon transition-all group
                ${isOverdue ? 'border-l-4 border-red-500' : ''}
            `}
        >
            {/* Header: Category and Priority */}
            <div className="flex justify-between items-start mb-2">
                <span className={`text-xs px-2 py-1 rounded border ${categoryColors[task.category] || categoryColors.other} bg-space-900/50 uppercase tracking-wider font-bold`}>
                    {task.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded border ${priorityConfig[priority].color} flex items-center gap-1 font-bold`}>
                    <FaFlag className="text-xs" />
                    {priorityConfig[priority].label}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-white mb-2 group-hover:text-holo-300 transition-colors">
                {task.title}
            </h3>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-slate-400 line-clamp-2 font-sans mb-3">
                    {task.description}
                </p>
            )}

            {/* Footer: Tags, Subtasks, Due Date */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                        {task.tags.slice(0, 2).map((tag, index) => (
                            <span key={tag} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center gap-1">
                                <FaTag className="text-xs" />
                                {tag}
                            </span>
                        ))}
                        {task.tags.length > 2 && (
                            <span className="text-slate-500">+{task.tags.length - 2}</span>
                        )}
                    </div>
                )}

                {/* Subtasks Progress */}
                {totalSubtasks > 0 && (
                    <span className="px-2 py-0.5 rounded bg-holo-500/10 border border-holo-500/30 text-holo-400 flex items-center gap-1">
                        <FaCheckCircle className="text-xs" />
                        {completedSubtasks}/{totalSubtasks}
                    </span>
                )}

                {/* Due Date */}
                {task.dueDate && (
                    <span className={`
                        px-2 py-0.5 rounded border flex items-center gap-1
                        ${isOverdue
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-space-900/50 border-slate-700 text-holo-400'
                        }
                    `}>
                        <FaClock className="text-xs" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                )}
            </div>
        </div>
    );
};

export default DraggableTaskCard;
