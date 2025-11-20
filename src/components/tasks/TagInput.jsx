import React, { useState } from 'react';
import { FaTimes, FaPlus, FaTag } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const TagInput = ({ tags = [], onAddTag, onRemoveTag, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTag = () => {
        const tag = inputValue.trim().toLowerCase();
        if (tag && !tags.includes(tag)) {
            onAddTag(tag);
            setInputValue('');
            setIsAdding(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        } else if (e.key === 'Escape') {
            setInputValue('');
            setIsAdding(false);
        }
    };

    const tagColors = [
        'bg-purple-500/20 text-purple-400 border-purple-500/50',
        'bg-pink-500/20 text-pink-400 border-pink-500/50',
        'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
        'bg-green-500/20 text-green-400 border-green-500/50',
        'bg-orange-500/20 text-orange-400 border-orange-500/50',
    ];

    const getTagColor = (index) => tagColors[index % tagColors.length];

    return (
        <div className="space-y-2">
            <label className="block text-sm text-holo-400 uppercase tracking-wider font-bold">
                <FaTag className="inline mr-2" />
                Tags
            </label>

            <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {tags.map((tag, index) => (
                        <motion.span
                            key={tag}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className={`
                                px-3 py-1 rounded-full text-xs font-medium border
                                flex items-center gap-2
                                ${getTagColor(index)}
                            `}
                        >
                            #{tag}
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => onRemoveTag(tag)}
                                    className="hover:scale-110 transition-transform"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                            )}
                        </motion.span>
                    ))}
                </AnimatePresence>

                {!disabled && (
                    <>
                        {isAdding ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="flex items-center gap-1"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onBlur={() => {
                                        if (!inputValue.trim()) setIsAdding(false);
                                    }}
                                    placeholder="tag name..."
                                    autoFocus
                                    className="
                                        bg-space-900 border border-holo-500/30 rounded-full
                                        px-3 py-1 text-xs text-white w-32
                                        focus:border-holo-500 focus:shadow-neon outline-none
                                    "
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="
                                        w-6 h-6 rounded-full bg-holo-500 text-space-900
                                        flex items-center justify-center
                                        hover:bg-holo-400 transition-colors
                                    "
                                >
                                    <FaPlus className="text-xs" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.button
                                type="button"
                                onClick={() => setIsAdding(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="
                                    px-3 py-1 rounded-full text-xs font-medium
                                    bg-space-900/50 border border-dashed border-holo-500/30
                                    text-holo-400 hover:border-holo-500 hover:text-holo-300
                                    transition-all flex items-center gap-1
                                "
                            >
                                <FaPlus className="text-xs" />
                                Add Tag
                            </motion.button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TagInput;
