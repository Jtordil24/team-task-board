import { PrismaClient } from '@prisma/client';
import { TaskStatus } from '../src/tasks/task-status';

const prisma = new PrismaClient();

async function main() {
  // Idempotent-ish seed: clear existing rows first so `prisma db seed` can be re-run.
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const [alice, bilal, carmen] = await Promise.all([
    prisma.user.create({ data: { name: 'Alice Nguyen', email: 'alice@example.com' } }),
    prisma.user.create({ data: { name: 'Bilal Ahmed', email: 'bilal@example.com' } }),
    prisma.user.create({ data: { name: 'Carmen Reyes', email: 'carmen@example.com' } }),
  ]);

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up CI pipeline',
        description: 'Add GitHub Actions workflow for lint + test on every PR.',
        status: TaskStatus.todo,
        assigneeId: alice.id,
      },
      {
        title: 'Design task board schema',
        description: 'Model Task/User relationship and write the ER diagram.',
        status: TaskStatus.done,
        assigneeId: alice.id,
      },
      {
        title: 'Build task list UI',
        description: 'MUI table/board with status grouping and filters.',
        status: TaskStatus.in_progress,
        assigneeId: bilal.id,
      },
      {
        title: 'Wire up Redux store',
        description: 'RTK Query slice for tasks + users, loading/error states.',
        status: TaskStatus.in_progress,
        assigneeId: carmen.id,
      },
      {
        title: 'Write backend tests',
        description: 'Unit tests for TasksService and e2e tests for the REST API.',
        status: TaskStatus.todo,
        assigneeId: null,
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
