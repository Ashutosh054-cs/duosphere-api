import { create } from 'zustand';
import { Todo } from '@/types';

interface TodoState {
  todos: Todo[];
  groupTodos: Record<string, Todo[]>; // groupId -> todos[]
  loading: boolean;
  error: string | null;

  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (todoId: string, updates: Partial<Todo>) => void;
  deleteTodo: (todoId: string) => void;
  toggleComplete: (todoId: string) => void;
  setGroupTodos: (groupId: string, todos: Todo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  groupTodos: {},
  loading: false,
  error: null,

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, todo],
    })),

  updateTodo: (todoId, updates) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === todoId ? { ...t, ...updates, updatedAt: Date.now() } : t
      ),
    })),

  deleteTodo: (todoId) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== todoId),
    })),

  toggleComplete: (todoId) =>
    set((state) => ({
      todos: state.todos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t
      ),
    })),

  setGroupTodos: (groupId, todos) =>
    set((state) => ({
      groupTodos: { ...state.groupTodos, [groupId]: todos },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      todos: [],
      groupTodos: {},
      loading: false,
      error: null,
    }),
}));
