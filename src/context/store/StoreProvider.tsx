import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
    type ContentItem,
    type IdeaItem,
    type TaskItem,
    contentBoard,
    initialIdeas,
    initialTasks,
} from '../../data/studio'

type StoreContextValue = {
    // Ideas
    ideas: IdeaItem[]
    addIdea: (idea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>) => void
    updateIdea: (id: string, updates: Partial<Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>>) => void
    deleteIdea: (id: string) => void

    // Board (Scheduled Content)
    board: ContentItem[]
    updateBoardItem: (id: string, updates: Partial<ContentItem>) => void

    // Tasks
    tasks: TaskItem[]
    updateTask: (id: string, updates: Partial<TaskItem>) => void
}

export const StoreContext = createContext<StoreContextValue | null>(null)

export function useStore() {
    const ctx = useContext(StoreContext)
    if (!ctx) {
        throw new Error('useStore must be used inside StoreProvider')
    }
    return ctx
}

// LocalStorage Helper
function usePersistedState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state))
        } catch (e) {
            console.error('Error saving to localStorage', e)
        }
    }, [key, state])

    return [state, setState] as const
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export function StoreProvider({ children }: { children: ReactNode }) {
    const [ideas, setIdeas] = usePersistedState<IdeaItem[]>('creatorhub_ideas', initialIdeas)
    const [board, setBoard] = usePersistedState<ContentItem[]>('creatorhub_board', contentBoard)
    const [tasks, setTasks] = usePersistedState<TaskItem[]>('creatorhub_tasks', initialTasks)

    const addIdea = (ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString()
        const newIdea: IdeaItem = {
            ...ideaData,
            id: `i_${generateId()}`,
            createdAt: now,
            updatedAt: now,
        }
        setIdeas((prev) => [newIdea, ...prev])
    }

    const updateIdea = (id: string, updates: Partial<Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>>) => {
        setIdeas((prev) =>
            prev.map((idea) =>
                idea.id === id
                    ? { ...idea, ...updates, updatedAt: new Date().toISOString() }
                    : idea
            )
        )
    }

    const deleteIdea = (id: string) => {
        setIdeas((prev) => prev.filter((idea) => idea.id !== id))
    }

    const updateBoardItem = (id: string, updates: Partial<ContentItem>) => {
        setBoard((prev) =>
            prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
        )
    }

    const updateTask = (id: string, updates: Partial<TaskItem>) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        )
    }

    const value: StoreContextValue = {
        ideas,
        addIdea,
        updateIdea,
        deleteIdea,
        board,
        updateBoardItem,
        tasks,
        updateTask,
    }

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    )
}
