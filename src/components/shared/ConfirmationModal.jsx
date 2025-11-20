import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes, FaCheck } from 'react-icons/fa';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDanger = false
}) => {
    // Handle Enter key
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (isOpen && e.key === 'Enter') {
                e.preventDefault();
                onConfirm();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onConfirm, onClose]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-space-900/80 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`
                        w-full max-w-md bg-space-800 border rounded-2xl p-6 shadow-neon relative
                        ${isDanger ? 'border-red-500/50' : 'border-holo-500/50'}
                    `}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    >
                        <FaTimes />
                    </button>

                    <div className="flex items-start gap-4 mb-6">
                        <div className={`
                            p-3 rounded-xl flex-shrink-0
                            ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-holo-500/10 text-holo-500'}
                        `}>
                            <FaExclamationTriangle className="text-xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-white mb-2">
                                {title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors font-medium"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`
                                px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg
                                ${isDanger
                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'
                                    : 'bg-holo-500 text-space-900 hover:bg-holo-400 shadow-holo-500/20'
                                }
                            `}
                        >
                            <FaCheck className="text-sm" />
                            {confirmLabel}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
