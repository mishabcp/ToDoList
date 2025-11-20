import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaFlag, FaTag, FaCalendar, FaCheck, FaEdit, FaTrash,
    FaCopy, FaChevronDown, FaChevronUp, FaCheckCircle
} from 'react-icons/fa';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';
import CreateTaskModal from '../shared/CreateTaskModal';
import ConfirmationModal from '../shared/ConfirmationModal';
import SearchBar from '../filters/SearchBar';
import FilterPanel from '../filters/FilterPanel';

const TaskListItem = ({ task, onEdit, onDelete, onComplete, onDuplicate }) => {
    const [showSubtasks, setShowSubtasks] = useState(false);
    const { toggleSubtask } = useStore();

    const priorityColors = {
        high: 'text-red-400 bg-red-500/10 border-red-500/30',
        medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
        low: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    };

    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
                holo-card p-4 rounded-xl mb-3
                ${task.completed ? 'opacity-60' : ''}
                ${isOverdue ? 'border-l-4 border-red-500' : ''}
                hover:border-holo-500/50 transition-all
            `}
        >
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                    onClick={() => onComplete(task.id)}
                    className={`
                        flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center
                        transition-all mt-1
                        ${task.completed
                            ? 'bg-holo-500 border-holo-500'
                            : 'border-slate-600 hover:border-holo-500'
                        }
                    `}
                >
                    {task.completed && <FaCheck className="text-space-900 text-sm" />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`
                            text-lg font-semibold text-white
                            ${task.completed ? 'line-through text-slate-500' : ''}
                        `}>
                            {task.title}
                        </h3>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(task);
                                }}
                                className="text-slate-400 hover:text-holo-400 transition-colors"
                                title="Edit"
                            >
                                <FaEdit className="text-sm" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDuplicate(task.id);
                                }}
                                className="text-slate-400 hover:text-holo-400 transition-colors"
                                title="Duplicate"
                            >
                                <FaCopy className="text-sm" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(task);
                                }}
                                className="text-slate-400 hover:text-red-400 transition-colors"
                                title="Delete"
                            >
                                <FaTrash className="text-sm" />
                            </button>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-slate-400 mb-3">{task.description}</p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {/* Priority */}
                        <span className={`
                            px-2 py-1 rounded border flex items-center gap-1
                            ${priorityColors[task.priority]}
                        `}>
                            <FaFlag className="text-xs" />
                            {task.priority}
                        </span>

                        {/* Category */}
                        <span className="px-2 py-1 rounded bg-space-900/50 border border-slate-700 text-slate-400">
                            {task.category}
                        </span>

                        {/* Due Date */}
                        <span className={`
                            px-2 py-1 rounded border flex items-center gap-1
                            ${isOverdue
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-space-900/50 border-slate-700 text-slate-400'
                            }
                        `}>
                            <FaCalendar className="text-xs" />
                            {new Date(task.dueDate).toLocaleDateString()}
                        </span>

                        {/* Tags */}
                        {task.tags?.map(tag => (
                            <span key={tag} className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center gap-1">
                                <FaTag className="text-xs" />
                                {tag}
                            </span>
                        ))}

                        {/* Subtasks Progress */}
                        {totalSubtasks > 0 && (
                            <button
                                onClick={() => setShowSubtasks(!showSubtasks)}
                                className="px-2 py-1 rounded bg-holo-500/10 border border-holo-500/30 text-holo-400 flex items-center gap-1 hover:bg-holo-500/20 transition-colors"
                            >
                                <FaCheckCircle className="text-xs" />
                                {completedSubtasks}/{totalSubtasks}
                                {showSubtasks ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                            </button>
                        )}
                    </div>

                    {/* Subtasks */}
                    <AnimatePresence>
                        {showSubtasks && totalSubtasks > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-3 pl-4 border-l-2 border-holo-500/30 space-y-2"
                            >
                                {task.subtasks.map(subtask => (
                                    <div key={subtask.id} className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleSubtask(task.id, subtask.id)}
                                            className={`
                                                w-4 h-4 rounded border flex items-center justify-center
                                                ${subtask.completed
                                                    ? 'bg-holo-500 border-holo-500'
                                                    : 'border-slate-600 hover:border-holo-500'
                                                }
                                            `}
                                        >
                                            {subtask.completed && <FaCheck className="text-space-900 text-xs" />}
                                        </button>
                                        <span className={`
                                            text-sm text-slate-300
                                            ${subtask.completed ? 'line-through text-slate-500' : ''}
                                        `}>
                                            {subtask.title}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

const ListView = () => {
    const { getFilteredTasks, completeTask, deleteTask, duplicateTask, tasks: allTasks } = useStore();
    const [editingTask, setEditingTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const tasks = getFilteredTasks();

    const handleComplete = (taskId) => {
        // Find the task to check its current status
        const task = allTasks.find(t => t.id === taskId);
        const wasCompleted = task?.completed;

        completeTask(taskId);

        // Show appropriate message based on action
        if (wasCompleted) {
            toast.success('Task marked as incomplete');
        } else {
            toast.success('Task completed! 🎉');
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete.id);
            toast.success('Task deleted');
            setTaskToDelete(null);
            setDeleteModalOpen(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDuplicate = (taskId) => {
        duplicateTask(taskId);
        toast.success('Task duplicated');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="space-y-6">
            {/* Header with Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <SearchBar />
                </div>
                <FilterPanel />
            </div>

            {/* Task Count */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                    {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
                </h2>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                <AnimatePresence>
                    {tasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20"
                        >
                            <p className="text-slate-500 text-lg">No tasks found</p>
                            <p className="text-slate-600 text-sm mt-2">Try adjusting your filters or create a new task</p>
                        </motion.div>
                    ) : (
                        tasks.map(task => (
                            <TaskListItem
                                key={task.id}
                                task={task}
                                onComplete={handleComplete}
                                onDelete={handleDeleteClick}
                                onEdit={handleEdit}
                                onDuplicate={handleDuplicate}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Edit Modal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                editTask={editingTask}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setTaskToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default ListView;
