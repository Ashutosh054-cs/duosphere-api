import { Todo } from '@/types';

export const createTodo = async (
  _userId: string,
  _title: string,
  _description: string,
  _groupId?: string,
  _priority: Todo['priority'] = 'medium',
  _dueDate?: number
): Promise<Todo> => {
  throw new Error('Todo creation is not implemented yet');
};

export const getUserTodos = async (
  _userId: string
): Promise<Todo[]> => {
  return [];
};

export const getGroupTodos = async (
  _groupId: string
): Promise<Todo[]> => {
  return [];
};

export const updateTodo = async (_todoId: string, _updates: Partial<Todo>): Promise<void> => {
  return;
};

export const completeTodoWithProof = async (
  _todoId: string,
  _proofImage: File
): Promise<string> => {
  throw new Error('Todo proof upload is not implemented yet');
};

export const deleteTodo = async (_todoId: string): Promise<void> => {
  return;
};

export const subscribeToUserTodos = (
  _userId: string,
  _callback: (todos: Todo[]) => void
): (() => void) => {
  return () => {};
};

export const subscribeToGroupTodos = (
  _groupId: string,
  _callback: (todos: Todo[]) => void
): (() => void) => {
  return () => {};
};
