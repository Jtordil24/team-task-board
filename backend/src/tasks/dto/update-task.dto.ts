import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// General-purpose edit for a task's content. Status changes go through the
// dedicated PATCH /tasks/:id/status endpoint + UpdateTaskStatusDto instead,
// so that "move a task to a new column" stays a single, explicit action.
export class UpdateTaskDto extends PartialType(OmitType(CreateTaskDto, ['status'] as const)) {}
