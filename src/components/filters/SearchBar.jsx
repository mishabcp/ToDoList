import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

const SearchBar = () => {
    const { searchQuery, setSearchQuery } = useStore();

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className="relative">
            <div className="relative flex items-center">
                <FaSearch className="absolute left-4 text-holo-400 text-sm" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="
                        w-full pl-11 pr-10 py-3 rounded-lg
                        bg-space-800/50 border border-holo-500/30
                        text-white placeholder-slate-500
                        focus:border-holo-500 focus:shadow-neon outline-none
                        transition-all
                    "
                />
                <AnimatePresence>
                    {searchQuery && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={handleClear}
                            className="
                                absolute right-3 text-slate-400 hover:text-white
                                transition-colors
                            "
                        >
                            <FaTimes className="text-sm" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchBar;
