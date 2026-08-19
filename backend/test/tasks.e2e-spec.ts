import 'reflect-metadata';
import { execSync } from 'child_process';
import { join } from 'path';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '../src/app.module';

// Isolated SQLite file for e2e runs so tests never touch prisma/dev.db.
// Relative sqlite paths in DATABASE_URL resolve relative to prisma/schema.prisma.
const TEST_DATABASE_URL = 'file:./test.db';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let userId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = TEST_DATABASE_URL;

    // Push the current Prisma schema onto the test database (creates/updates
    // prisma/test.db). --accept-data-loss is safe here: it's a throwaway file.
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      cwd: join(__dirname, '..'),
      env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
      stdio: 'inherit',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // Clean slate between tests, then seed one user to assign tasks to.
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    const user = await prisma.user.create({
      data: { name: 'Test User', email: 'test-user@example.com' },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    await app.close();
  });

  it('POST /api/tasks creates a task', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Write README', description: 'Include ER diagram', assigneeId: userId })
      .expect(201);

    expect(res.body).toMatchObject({
      title: 'Write README',
      description: 'Include ER diagram',
      status: 'todo',
      assigneeId: userId,
    });
    expect(res.body.assignee).toMatchObject({ id: userId, name: 'Test User' });
  });

  it('POST /api/tasks rejects a task without a title', async () => {
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ description: 'No title here' })
      .expect(400);
  });

  it('GET /api/tasks lists tasks and supports status/assignee filters', async () => {
    await request(app.getHttpServer()).post('/api/tasks').send({ title: 'Task A', status: 'todo' });
    await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Task B', status: 'done', assigneeId: userId });

    const all = await request(app.getHttpServer()).get('/api/tasks').expect(200);
    expect(all.body).toHaveLength(2);

    const byStatus = await request(app.getHttpServer()).get('/api/tasks?status=done').expect(200);
    expect(byStatus.body).toHaveLength(1);
    expect(byStatus.body[0].title).toBe('Task B');

    const byAssignee = await request(app.getHttpServer())
      .get(`/api/tasks?assigneeId=${userId}`)
      .expect(200);
    expect(byAssignee.body).toHaveLength(1);
    expect(byAssignee.body[0].title).toBe('Task B');
  });

  it('PATCH /api/tasks/:id/status moves a task between columns', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Move me' });

    const updated = await request(app.getHttpServer())
      .patch(`/api/tasks/${created.body.id}/status`)
      .send({ status: 'in_progress' })
      .expect(200);

    expect(updated.body.status).toBe('in_progress');
  });

  it('PATCH /api/tasks/:id/status 404s for an unknown task', async () => {
    await request(app.getHttpServer())
      .patch('/api/tasks/00000000-0000-0000-0000-000000000000/status')
      .send({ status: 'done' })
      .expect(404);
  });

  it('DELETE /api/tasks/:id removes the task', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/tasks')
      .send({ title: 'Delete me' });

    await request(app.getHttpServer()).delete(`/api/tasks/${created.body.id}`).expect(204);
    await request(app.getHttpServer()).get(`/api/tasks/${created.body.id}`).expect(404);
  });
});
