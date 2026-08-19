import { IsEnum } from 'class-validator';
import { TaskStatus } from '../task-status';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, { message: 'status must be one of: todo, in_progress, done' })
  status: TaskStatus;
}
