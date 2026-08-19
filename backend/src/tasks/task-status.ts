// SQLite doesn't support native enum columns, so Task.status is a plain
// String column in schema.prisma. This enum is the single source of truth
// for the allowed values, used by the DTOs' @IsEnum and by the frontend.
export enum TaskStatus {
  todo = 'todo',
  in_progress = 'in_progress',
  done = 'done',
}

export const TASK_STATUS_VALUES = Object.values(TaskStatus);
