import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TASK_REPOSITORY, InMemoryTaskRepository } from './repositories';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TASK_REPOSITORY,
      useClass: InMemoryTaskRepository,
    },
  ],
})
export class TasksModule {}
