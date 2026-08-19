import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaskStatus } from '../task-status';

export class QueryTasksDto {
  @IsOptional()
  @IsEnum(TaskStatus, { message: 'status must be one of: todo, in_progress, done' })
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
