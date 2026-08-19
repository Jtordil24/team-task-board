import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, TasksModule, UsersModule],
})
export class AppModule {}
