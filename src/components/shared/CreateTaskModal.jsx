import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';
import useStore from '../../store/useStore';
import { toast } from 'react-hot-toast';
import PrioritySelector from '../tasks/PrioritySelector';
import TagInput from '../tasks/TagInput';
import SubtaskList from '../tasks/SubtaskList';

const CreateTaskModal = ({ isOpen, onClose, editTask = null }) => {
    const { addTask, updateTask } = useStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('personal');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [tags, setTags] = useState([]);
    const [subtasks, setSubtasks] = useState([]);

    // Sync state when editTask changes or modal opens
    useEffect(() => {
        if (editTask && isOpen) {
            setTitle(editTask.title || '');
            setDescription(editTask.description || '');
            setCategory(editTask.category || 'personal');
            setPriority(editTask.priority || 'medium');
            setDueDate(
                editTask.dueDate
                    ? new Date(editTask.dueDate).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0]
            );
            setTags(editTask.tags || []);
            setSubtasks(editTask.subtasks || []);
        } else if (!editTask && isOpen) {
            // Reset to defaults when creating new task
            resetForm();
        }
    }, [editTask, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Please enter a task title');
            return;
        }

        const taskData = {
            title: title.trim(),
            description: description.trim(),
            category,
            priority,
            dueDate: new Date(dueDate),
            tags,
            subtasks,
            status: editTask?.status || 'todo',
        };

        if (editTask) {
            updateTask({ ...editTask, ...taskData });
            toast.success('Task Updated');
        } else {
            addTask(taskData);
            toast.success('Task Created');
        }

        resetForm();
        onClose();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setCategory('personal');
        setPriority('medium');
        setDueDate(new Date().toISOString().split('T')[0]);
        setTags([]);
        setSubtasks([]);
    };

    const handleAddTag = (tag) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const handleRemoveTag = (tag) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleAddSubtask = (subtask) => {
        setSubtasks([...subtasks, {
            id: Date.now().toString(),
            title: subtask.title,
            completed: false
        }]);
    };

    const handleToggleSubtask = (subtaskId) => {
        setSubtasks(subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
        ));
    };

    const handleDeleteSubtask = (subtaskId) => {
        setSubtasks(subtasks.filter(st => st.id !== subtaskId));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-900/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-2xl bg-space-800 border border-holo-500/50 rounded-2xl p-6 shadow-neon relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                    >
                        <FaTimes />
                    </button>

                    <h2 className="text-2xl font-display font-bold text-white mb-6">
                        {editTask ? 'Edit Task' : 'Create New Task'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Task Title */}
                        <div>
                            <label className="block text-sm text-holo-400 mb-1 uppercase tracking-wider font-bold">
                                Task Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-space-900 border border-holo-500/30 rounded-lg px-4 py-3 text-white focus:border-holo-500 focus:shadow-neon outline-none transition-all"
                                placeholder="Enter task title..."
                                autoFocus
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm text-holo-400 mb-1 uppercase tracking-wider font-bold">
                                Details
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-space-900 border border-holo-500/30 rounded-lg px-4 py-3 text-white focus:border-holo-500 focus:shadow-neon outline-none transition-all h-24 resize-none"
                                placeholder="Additional details..."
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm text-holo-400 mb-2 uppercase tracking-wider font-bold">
                                Priority
                            </label>
                            <PrioritySelector value={priority} onChange={setPriority} />
                        </div>

                        {/* Category & Due Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-holo-400 mb-1 uppercase tracking-wider font-bold">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-space-900 border border-holo-500/30 rounded-lg px-4 py-3 text-white focus:border-holo-500 outline-none"
                                >
                                    <option value="personal">Personal</option>
                                    <option value="work">Work</option>
                                    <option value="shopping">Shopping</option>
                                    <option value="health">Health</option>
                                    <option value="learning">Learning</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-holo-400 mb-1 uppercase tracking-wider font-bold">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-space-900 border border-holo-500/30 rounded-lg px-4 py-3 text-white focus:border-holo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Tags */}
                        <TagInput
                            tags={tags}
                            onAddTag={handleAddTag}
                            onRemoveTag={handleRemoveTag}
                        />

                        {/* Subtasks */}
                        <SubtaskList
                            subtasks={subtasks}
                            onAdd={handleAddSubtask}
                            onToggle={handleToggleSubtask}
                            onDelete={handleDeleteSubtask}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-holo-500 text-space-900 font-bold py-3 rounded-lg hover:bg-holo-400 transition-colors shadow-neon mt-6 flex items-center justify-center gap-2"
                        >
                            <FaPlus />
                            {editTask ? 'Update Task' : 'Create Task'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateTaskModal;
