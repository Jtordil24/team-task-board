import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateTaskInput, Task, TaskStatus, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface TaskFilters {
  status?: TaskStatus;
  assigneeId?: string;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Task', 'User'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], TaskFilters | void>({
      query: (filters) => ({
        url: '/tasks',
        params: filters ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [...result.map((task) => ({ type: 'Task' as const, id: task.id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),

    createTask: builder.mutation<Task, CreateTaskInput>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    updateTaskStatus: builder.mutation<Task, { id: string; status: TaskStatus }>({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      // Refetch is simple and correct; an optimistic update would also need to
      // guess every active filter combination's cache key, which isn't worth
      // the complexity for a board this size.
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),

    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useGetUsersQuery,
} = api;
