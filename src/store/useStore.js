import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // --- User Profile ---
            username: 'User',
            setUsername: (name) => set({ username: name }),

            // --- User Stats ---
            streak: 0,
            lastCompletionDate: null,

            // --- Tasks ---
            tasks: [],

            addTask: (task) => set((state) => {
                const newTask = {
                    ...task,
                    id: task.id || Date.now().toString(),
                    createdAt: task.createdAt || new Date().toISOString(),
                    completedAt: null,
                    priority: task.priority || 'medium',
                    tags: task.tags || [],
                    subtasks: task.subtasks || [],
                    attachments: task.attachments || [],
                    recurring: task.recurring || null,
                    dependsOn: task.dependsOn || [],
                    status: task.status || 'todo',
                    completed: false,
                };
                return { tasks: [newTask, ...state.tasks] };
            }),

            updateTask: (updatedTask) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === updatedTask.id ? { ...t, ...updatedTask } : t
                ),
            })),

            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),

            moveTask: (id, newStatus) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, status: newStatus } : t
                ),
            })),

            completeTask: (id) => set((state) => {
                const task = state.tasks.find(t => t.id === id);
                if (!task) return state;

                // Toggle completion status
                const isCompleting = !task.completed;

                const updatedTasks = state.tasks.map((t) =>
                    t.id === id
                        ? {
                            ...t,
                            completed: isCompleting,
                            completedAt: isCompleting ? new Date().toISOString() : null,
                            status: isCompleting ? 'done' : 'todo'
                        }
                        : t
                );

                // Update streak only when completing (not uncompleting)
                if (isCompleting) {
                    const today = new Date().toDateString();
                    const lastDate = state.lastCompletionDate;
                    let newStreak = state.streak;

                    if (!lastDate) {
                        newStreak = 1;
                    } else if (lastDate !== today) {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        newStreak = lastDate === yesterday.toDateString() ? state.streak + 1 : 1;
                    }

                    return {
                        tasks: updatedTasks,
                        streak: newStreak,
                        lastCompletionDate: today,
                    };
                }

                return { tasks: updatedTasks };
            }),

            // --- Subtask Operations ---
            addSubtask: (taskId, subtask) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? {
                            ...t,
                            subtasks: [...t.subtasks, {
                                id: Date.now().toString(),
                                title: subtask.title,
                                completed: false
                            }]
                        }
                        : t
                ),
            })),

            toggleSubtask: (taskId, subtaskId) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? {
                            ...t,
                            subtasks: t.subtasks.map(st =>
                                st.id === subtaskId ? { ...st, completed: !st.completed } : st
                            )
                        }
                        : t
                ),
            })),

            deleteSubtask: (taskId, subtaskId) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? { ...t, subtasks: t.subtasks.filter(st => st.id !== subtaskId) }
                        : t
                ),
            })),

            // --- Priority & Tags ---
            updateTaskPriority: (taskId, priority) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId ? { ...t, priority } : t
                ),
            })),

            addTaskTag: (taskId, tag) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId && !t.tags.includes(tag)
                        ? { ...t, tags: [...t.tags, tag] }
                        : t
                ),
            })),

            removeTaskTag: (taskId, tag) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? { ...t, tags: t.tags.filter(tg => tg !== tag) }
                        : t
                ),
            })),

            // --- Attachments ---
            addAttachment: (taskId, attachment) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? {
                            ...t,
                            attachments: [...t.attachments, {
                                id: Date.now().toString(),
                                ...attachment
                            }]
                        }
                        : t
                ),
            })),

            removeAttachment: (taskId, attachmentId) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId
                        ? { ...t, attachments: t.attachments.filter(a => a.id !== attachmentId) }
                        : t
                ),
            })),

            // --- Bulk Operations ---
            duplicateTask: (taskId) => set((state) => {
                const task = state.tasks.find(t => t.id === taskId);
                if (!task) return state;

                const duplicated = {
                    ...task,
                    id: Date.now().toString(),
                    title: `${task.title} (Copy)`,
                    createdAt: new Date().toISOString(),
                    completed: false,
                    completedAt: null,
                };

                return { tasks: [duplicated, ...state.tasks] };
            }),

            archiveTask: (taskId) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === taskId ? { ...t, archived: true } : t
                ),
            })),

            // --- Data Management ---
            clearAllTasks: () => set({ tasks: [] }),

            exportTasks: () => {
                const { tasks } = get();
                const dataStr = JSON.stringify(tasks, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
            },

            importTasks: (tasksData) => set({ tasks: tasksData }),

            // --- Filters & Search ---
            searchQuery: '',
            setSearchQuery: (query) => set({ searchQuery: query }),

            activeFilters: {
                priorities: [],
                tags: [],
                categories: [],
                dateRange: null,
                status: [],
            },
            setFilters: (filters) => set({ activeFilters: filters }),

            sorting: 'newest',
            setSorting: (sort) => set({ sorting: sort }),

            // --- Helper Functions ---
            getFilteredTasks: () => {
                const { tasks, searchQuery, activeFilters, sorting } = get();

                let filtered = tasks.filter(task => {
                    // Exclude archived tasks
                    if (task.archived) return false;

                    // Search filter
                    if (searchQuery) {
                        const query = searchQuery.toLowerCase();
                        const matchesTitle = task.title.toLowerCase().includes(query);
                        const matchesDescription = task.description?.toLowerCase().includes(query);
                        const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(query));
                        if (!matchesTitle && !matchesDescription && !matchesTags) return false;
                    }

                    // Priority filter
                    if (activeFilters.priorities.length > 0) {
                        if (!activeFilters.priorities.includes(task.priority)) return false;
                    }

                    // Status filter
                    if (activeFilters.status.length > 0) {
                        if (!activeFilters.status.includes(task.status)) return false;
                    }

                    // Category filter
                    if (activeFilters.categories.length > 0) {
                        if (!activeFilters.categories.includes(task.category)) return false;
                    }

                    // Tag filter
                    if (activeFilters.tags.length > 0) {
                        const hasMatchingTag = activeFilters.tags.some(filterTag =>
                            task.tags?.includes(filterTag)
                        );
                        if (!hasMatchingTag) return false;
                    }

                    return true;
                });

                // Sort
                filtered.sort((a, b) => {
                    switch (sorting) {
                        case 'newest':
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        case 'oldest':
                            return new Date(a.createdAt) - new Date(b.createdAt);
                        case 'dueDate':
                            return new Date(a.dueDate) - new Date(b.dueDate);
                        case 'priority':
                            const priorityOrder = { high: 3, medium: 2, low: 1 };
                            return priorityOrder[b.priority] - priorityOrder[a.priority];
                        default:
                            return 0;
                    }
                });

                return filtered;
            },

            // --- Goals ---
            goals: [],
            addGoal: (goal) => set((state) => ({
                goals: [...state.goals, { ...goal, id: Date.now().toString(), progress: 0 }],
            })),
            updateGoal: (goalId, updates) => set((state) => ({
                goals: state.goals.map(g => g.id === goalId ? { ...g, ...updates } : g),
            })),
            deleteGoal: (goalId) => set((state) => ({
                goals: state.goals.filter(g => g.id !== goalId),
            })),

            // --- Achievements ---
            achievements: [],
            unlockAchievement: (achievement) => set((state) => ({
                achievements: [...state.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
            })),

            // --- Theme ---
            theme: 'dark',
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'todo-storage',
        }
    )
);

export default useStore;
