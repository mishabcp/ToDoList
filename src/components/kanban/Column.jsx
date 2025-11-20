import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import DraggableTaskCard from './DraggableTaskCard';

const Column = ({ id, title, tasks }) => {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex-1 min-w-[300px] bg-space-800/30 rounded-2xl p-4 border border-holo-500/10 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="font-display font-bold text-lg text-holo-100 tracking-wider uppercase">
                    {title}
                </h2>
                <span className="bg-holo-500/20 text-holo-400 px-2 py-1 rounded text-xs font-bold">
                    {tasks.length}
                </span>
            </div>

            <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px]">
                {tasks.map((task) => (
                    <DraggableTaskCard key={task.id} task={task} />
                ))}
                {tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center text-slate-600 text-sm">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
};

export default Column;
