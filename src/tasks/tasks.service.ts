import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { UUID } from 'src/common/types';

import { CreateTaskDto, FindAllTasksDto } from './dto';
import { Task } from './types';
import { TASK_REPOSITORY, TaskRepository } from './repositories';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: TaskRepository
  ) {}

  create(data: CreateTaskDto): Task {
    const overlappingTasks = this.taskRepository.findOverlappingTasks(
      data.user_id,
      data.starts_at,
      data.ends_at
    );

    if (overlappingTasks.length > 0) {
      throw new BadRequestException('User already has a task in this time period');
    }

    const task: Task = {
      id: randomUUID(),
      name: data.name,
      status: 'new',
      user_id: data.user_id,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      created_at: new Date().toISOString(),
    };

    return this.taskRepository.save(task);
  }

  findAll(filters?: FindAllTasksDto): Task[] {
    return this.taskRepository.findAll(filters);
  }

  complete(id: UUID): Task {
    const task = this.taskRepository.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.status === 'completed') {
      throw new BadRequestException('Task already completed');
    }

    task.status = 'completed';

    return this.taskRepository.save(task);
  }
}
