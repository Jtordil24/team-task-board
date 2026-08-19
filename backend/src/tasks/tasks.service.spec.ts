import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from './task-status';

// A hand-rolled mock keeps this a true unit test: no real database, and we
// can assert exactly which Prisma calls each service method makes.
const mockPrisma = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('is defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a task with the assignee included', async () => {
      const dto = { title: 'Write tests', description: 'Cover the service', assigneeId: 'user-1' };
      const created = { id: 'task-1', ...dto, status: TaskStatus.todo, assignee: null };
      mockPrisma.task.create.mockResolvedValue(created);

      const result = await service.create(dto as any);

      expect(mockPrisma.task.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ title: 'Write tests', assigneeId: 'user-1' }),
          include: { assignee: true },
        }),
      );
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('passes status and assigneeId through to the Prisma where clause', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      await service.findAll({ status: TaskStatus.in_progress, assigneeId: 'user-2' });

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: TaskStatus.in_progress, assigneeId: 'user-2' },
        }),
      );
    });

    it('leaves filters undefined when none are given (no filtering)', async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      await service.findAll({});

      expect(mockPrisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: undefined, assigneeId: undefined },
        }),
      );
    });
  });

  describe('updateStatus', () => {
    it('updates the status when the task exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 'task-1' });
      const updated = { id: 'task-1', status: TaskStatus.done };
      mockPrisma.task.update.mockResolvedValue(updated);

      const result = await service.updateStatus('task-1', { status: TaskStatus.done });

      expect(mockPrisma.task.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'task-1' },
          data: { status: TaskStatus.done },
        }),
      );
      expect(result).toEqual(updated);
    });

    it('throws NotFoundException when the task does not exist', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus('missing', { status: TaskStatus.done })).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrisma.task.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('deletes the task when it exists', async () => {
      mockPrisma.task.findUnique.mockResolvedValue({ id: 'task-1' });
      mockPrisma.task.delete.mockResolvedValue({ id: 'task-1' });

      await service.remove('task-1');

      expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } });
    });

    it('throws NotFoundException instead of calling delete when missing', async () => {
      mockPrisma.task.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
      expect(mockPrisma.task.delete).not.toHaveBeenCalled();
    });
  });
});
