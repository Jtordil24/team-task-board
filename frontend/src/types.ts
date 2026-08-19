export type TaskStatus = 'todo' | 'in_progress' | 'done';

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigneeId: string | null;
  assignee: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  assigneeId?: string;
}
