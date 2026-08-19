import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

// Shared include so every response shape is consistent: callers get the
// assignee's basic info inline instead of just a bare assigneeId.
const taskWithAssignee = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: { assignee: true },
});

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        assigneeId: dto.assigneeId,
      },
      ...taskWithAssignee,
    });
  }

  findAll(query: QueryTasksDto) {
    return this.prisma.task.findMany({
      where: {
        status: query.status,
        assigneeId: query.assigneeId,
      },
      orderBy: { createdAt: 'desc' },
      ...taskWithAssignee,
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      ...taskWithAssignee,
    });
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.ensureExists(id);
    return this.prisma.task.update({
      where: { id },
      data: dto,
      ...taskWithAssignee,
    });
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto) {
    await this.ensureExists(id);
    return this.prisma.task.update({
      where: { id },
      data: { status: dto.status },
      ...taskWithAssignee,
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.task.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.task.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Task ${id} not found`);
    }
  }
}
