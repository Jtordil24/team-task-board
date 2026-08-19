import { IsEnum, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../task-status';

export class CreateTaskDto {
  @IsString()
  @MinLength(1, { message: 'title must not be empty' })
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'status must be one of: todo, in_progress, done' })
  status?: TaskStatus;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;
}
