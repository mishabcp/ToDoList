import React, { useState } from 'react';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

const FilterPanel = () => {
    const { activeFilters, setFilters, tasks } = useStore();
    const [isOpen, setIsOpen] = useState(false);

    // Get unique values from tasks
    const uniqueCategories = [...new Set(tasks.map(t => t.category))];
    const uniqueTags = [...new Set(tasks.flatMap(t => t.tags || []))];

    const togglePriority = (priority) => {
        const priorities = activeFilters.priorities.includes(priority)
            ? activeFilters.priorities.filter(p => p !== priority)
            : [...activeFilters.priorities, priority];
        setFilters({ ...activeFilters, priorities });
    };

    const toggleStatus = (status) => {
        const statuses = activeFilters.status.includes(status)
            ? activeFilters.status.filter(s => s !== status)
            : [...activeFilters.status, status];
        setFilters({ ...activeFilters, status: statuses });
    };

    const toggleCategory = (category) => {
        const categories = activeFilters.categories.includes(category)
            ? activeFilters.categories.filter(c => c !== category)
            : [...activeFilters.categories, category];
        setFilters({ ...activeFilters, categories });
    };

    const toggleTag = (tag) => {
        const tags = activeFilters.tags.includes(tag)
            ? activeFilters.tags.filter(t => t !== tag)
            : [...activeFilters.tags, tag];
        setFilters({ ...activeFilters, tags });
    };

    const clearAllFilters = () => {
        setFilters({
            priorities: [],
            tags: [],
            categories: [],
            dateRange: null,
            status: [],
        });
    };

    const activeFilterCount =
        activeFilters.priorities.length +
        activeFilters.tags.length +
        activeFilters.categories.length +
        activeFilters.status.length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center gap-2 px-4 py-3 rounded-lg
                    bg-space-800/50 border border-holo-500/30
                    text-holo-400 hover:border-holo-500 hover:text-holo-300
                    transition-all relative
                "
            >
                <FaFilter />
                <span className="font-medium">Filters</span>
                {activeFilterCount > 0 && (
                    <span className="
                        absolute -top-2 -right-2 w-6 h-6 rounded-full
                        bg-neon-pink text-white text-xs font-bold
                        flex items-center justify-center
                    ">
                        {activeFilterCount}
                    </span>
                )}
                {isOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="
                            absolute top-full mt-2 right-0 w-80
                            bg-space-800 border border-holo-500/50 rounded-xl
                            shadow-neon p-4 z-50
                        "
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold">Filter Tasks</h3>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearAllFilters}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                            {/* Priority Filter */}
                            <div>
                                <label className="block text-xs text-holo-400 uppercase tracking-wider font-bold mb-2">
                                    Priority
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['high', 'medium', 'low'].map(priority => (
                                        <button
                                            key={priority}
                                            onClick={() => togglePriority(priority)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                ${activeFilters.priorities.includes(priority)
                                                    ? 'bg-holo-500/20 border-holo-500 text-holo-300'
                                                    : 'bg-space-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }
                                            `}
                                        >
                                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-xs text-holo-400 uppercase tracking-wider font-bold mb-2">
                                    Status
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['todo', 'in-progress', 'done'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => toggleStatus(status)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                ${activeFilters.status.includes(status)
                                                    ? 'bg-holo-500/20 border-holo-500 text-holo-300'
                                                    : 'bg-space-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                }
                                            `}
                                        >
                                            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Filter */}
                            {uniqueCategories.length > 0 && (
                                <div>
                                    <label className="block text-xs text-holo-400 uppercase tracking-wider font-bold mb-2">
                                        Category
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueCategories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => toggleCategory(category)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                    ${activeFilters.categories.includes(category)
                                                        ? 'bg-holo-500/20 border-holo-500 text-holo-300'
                                                        : 'bg-space-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }
                                                `}
                                            >
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tag Filter */}
                            {uniqueTags.length > 0 && (
                                <div>
                                    <label className="block text-xs text-holo-400 uppercase tracking-wider font-bold mb-2">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {uniqueTags.map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className={`
                                                    px-3 py-1.5 rounded-lg text-xs font-medium border transition-all
                                                    ${activeFilters.tags.includes(tag)
                                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                                        : 'bg-space-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                                    }
                                                `}
                                            >
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FilterPanel;
