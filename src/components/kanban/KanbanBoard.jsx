import React from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    useDroppable,
    pointerWithin,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor
} from '@dnd-kit/core';
import Column from './Column';
import useStore from '../../store/useStore';
import DraggableTaskCard from './DraggableTaskCard';
import { useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '../shared/ConfirmationModal';

const RecycleBin = () => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'recycle-bin',
    });

    return (
        <motion.div
            ref={setNodeRef}
            animate={{
                scale: isOver ? 1.05 : 1,
                backgroundColor: isOver ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
            }}
            className={`
                flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed
                transition-all duration-200
                ${isOver
                    ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                    : 'border-red-500/30 bg-red-500/10'
                }
            `}
        >
            <FaTrash className={`text-3xl ${isOver ? 'text-red-400' : 'text-red-500/50'}`} />
            <div>
                <p className={`font-bold ${isOver ? 'text-red-400' : 'text-red-500/70'}`}>
                    {isOver ? 'Drop to Delete' : 'Recycle Bin'}
                </p>
                <p className="text-xs text-slate-500">Drag tasks here to delete</p>
            </div>
        </motion.div>
    );
};

const KanbanBoard = () => {
    const { tasks, moveTask, deleteTask } = useStore();
    const [activeId, setActiveId] = useState(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    // Sensors for Drag and Drop
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10, // Enable drag after 10px movement
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250, // Enable drag after 250ms delay (tap and hold)
                tolerance: 5, // Allow 5px movement during delay
            },
        })
    );

    // Filter tasks by status
    const todoTasks = tasks.filter(t => !t.status || t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over) {
            // Check if dropped on recycle bin
            if (over.id === 'recycle-bin') {
                const task = tasks.find(t => t.id === active.id);
                setTaskToDelete(task);
                setDeleteModalOpen(true);
            } else if (active.id !== over.id) {
                // Determine new status based on drop column id
                moveTask(active.id, over.id);
            }
        }
        setActiveId(null);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            deleteTask(taskToDelete.id);
            toast.success('Task deleted');
            setTaskToDelete(null);
        }
    };

    // Custom collision detection to prioritize recycle bin
    const customCollisionDetection = useCallback((args) => {
        // First, check if we're over the recycle bin using pointerWithin
        // This ensures that as soon as the mouse enters the bin, it activates
        const pointerCollisions = pointerWithin(args);
        const recycleBinCollision = pointerCollisions.find(c => c.id === 'recycle-bin');

        if (recycleBinCollision) {
            return [recycleBinCollision];
        }

        // Otherwise, use closestCorners for columns
        return closestCorners(args);
    }, []);

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-display font-bold text-white glow-text">
                    KANBAN BOARD
                </h1>
            </div>

            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                collisionDetection={customCollisionDetection}
            >
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Kanban Columns */}
                    <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                        <Column id="todo" title="To Do" tasks={todoTasks} />
                        <Column id="in-progress" title="In Progress" tasks={inProgressTasks} />
                        <Column id="done" title="Completed" tasks={doneTasks} />
                    </div>

                    {/* Recycle Bin */}
                    <div className="flex-shrink-0">
                        <RecycleBin />
                    </div>
                </div>

                <DragOverlay>
                    {activeTask ? <DraggableTaskCard task={activeTask} /> : null}
                </DragOverlay>
            </DndContext>

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message={`Are you sure you want to delete "${taskToDelete?.title}"?`}
                confirmLabel="Delete"
                isDanger={true}
            />
        </div>
    );
};

export default KanbanBoard;
